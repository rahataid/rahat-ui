import { useMemo } from 'react';
import { getProjectClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { TAGS } from '../../config';
import { useNewCommunicationQuery } from '../new-comms/new-comms.provider';
import { useListAllTransports } from '../new-comms/new-comms.query';
import { useProjectList } from '../projects';
import {
  CommunicationActivityItem,
  CommunicationLogsFilterParams,
  TransportEntry,
} from './communication-overview.types';
import {
  buildTargetProjects,
  classifyTransportString,
  EMPTY_ACTIVITIES,
  EMPTY_PROJECTS,
  filterCommunicationActivities,
  resolveCommRowsWithBroadcastCounts,
  STALE_5MIN,
  transformActivitiesToCommunicationRows,
  transformCommunicationsToCommunicationRows,
} from './communication-overview.utils';

export * from './communication-overview.types';
export * from './communication-overview.utils';

type ProjectClient = ReturnType<typeof getProjectClient>;

async function fetchPaginatedProjectAction<T>(
  client: ProjectClient,
  uuid: UUID,
  action: string,
  basePayload: Record<string, unknown> = {},
  perPage = 100,
): Promise<T[]> {
  const allItems: T[] = [];
  let page = 1;
  let lastPage = 1;

  while (page <= lastPage) {
    const res = (await client.projectActions({
      uuid,
      data: {
        action,
        payload: { ...basePayload, perPage, page },
      },
    })) as Record<string, unknown>;

    const responseObj = res?.['response'] as Record<string, unknown> | undefined;
    const dataObj = res?.['data'] as Record<string, unknown> | undefined;

    const meta = (responseObj?.['meta'] ?? dataObj?.['meta'] ?? res?.['meta']) as
      | Record<string, unknown>
      | undefined;

    if (meta?.['lastPage']) {
      lastPage = Number(meta['lastPage']);
    }

    const items = (responseObj?.['data'] ?? dataObj?.['data'] ?? res?.['data'] ?? []) as T[];

    if (!Array.isArray(items) || items.length === 0) break;

    allItems.push(...items);
    page++;
  }

  return allItems;
}

export const useCommunicationOverviewActivities = (
  params?: CommunicationLogsFilterParams,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectList();
  const appTransports = useListAllTransports();
  const { newCommunicationService } = useNewCommunicationQuery();

  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const backendRecipient =
    params?.recipient && params.recipient !== 'all'
      ? params.recipient.toUpperCase()
      : undefined;

  const backendTransportId = useMemo(() => {
    if (!params?.channel || params.channel === 'all' || !Array.isArray(appTransports))
      return undefined;
    const targetChannel = classifyTransportString(params.channel);
    const match = appTransports.find(
      (t) => t && classifyTransportString(t.name || t.type || '') === targetChannel,
    );
    return match?.cuid || undefined;
  }, [params?.channel, appTransports]);

  const baseQueryKey = useMemo(
    () => [
      TAGS.COMMUNICATION_OVERVIEW.LIST_COMMUNICATION_ACTIVITIES,
      params?.project || 'all',
      Boolean(newCommunicationService),
      backendRecipient || 'all',
      backendTransportId || 'all',
    ],
    [
      params?.project,
      Boolean(newCommunicationService),
      backendRecipient,
      backendTransportId,
    ],
  );

  const query = useQuery<CommunicationActivityItem[], Error>(
    {
      queryKey: baseQueryKey,
      enabled: !isLoadingProjects && projectList.length > 0,
      queryFn: async () => {
        const targets = buildTargetProjects(projectList, params?.project);
        if (!targets.length) return [];

        const rows: CommunicationActivityItem[] = [];
        const commRows: CommunicationActivityItem[] = [];

        await Promise.allSettled(
          targets.map(async (proj) => {
            const projUuid = proj.uuid as UUID;
            await Promise.allSettled([
              // 1. Fetch Anticipatory Action / Activity-based communications
              (async () => {
                const activities = await fetchPaginatedProjectAction<Record<string, unknown>>(
                  projectClient,
                  projUuid,
                  'ms.activities.getHavingComms',
                );
                if (activities.length > 0) {
                  rows.push(
                    ...transformActivitiesToCommunicationRows(
                      activities,
                      proj,
                      appTransports as TransportEntry[],
                    ),
                  );
                }
              })(),

              // 2. Fetch Multi-Group Communication Campaigns
              (async () => {
                const communications = await fetchPaginatedProjectAction<Record<string, unknown>>(
                  projectClient,
                  projUuid,
                  'ms.communications.getAll',
                  {
                    xrefId: proj.uuid,
                    ...(backendRecipient && { groupType: backendRecipient }),
                    ...(backendTransportId && { transportId: backendTransportId }),
                  },
                );
                if (communications.length > 0) {
                  commRows.push(
                    ...transformCommunicationsToCommunicationRows(
                      communications,
                      proj,
                      appTransports as TransportEntry[],
                    ),
                  );
                }
              })(),
            ]);
          }),
        );

        // Deduplicate communications created through activities
        const seenCommIds = new Set(commRows.map((c) => c.communicationId).filter(Boolean));
        const seenSessionIds = new Set(commRows.map((c) => c.sessionId).filter(Boolean));

        const dedupedActivities = rows.filter(
          (act) =>
            (!act.communicationId || !seenCommIds.has(act.communicationId)) &&
            (!act.sessionId || !seenSessionIds.has(act.sessionId)),
        );

        const allRows = [...dedupedActivities, ...commRows];

        // Hydrate rows with verified microservice delivery stats
        await resolveCommRowsWithBroadcastCounts(allRows, newCommunicationService);

        allRows.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        return allRows;
      },
      staleTime: STALE_5MIN,
    },
    queryClient,
  );

  const allActivities = query.data ?? EMPTY_ACTIVITIES;
  const filtered = useMemo(
    () => filterCommunicationActivities(allActivities, params),
    [allActivities, params],
  );

  return useMemo(
    () => ({ ...query, data: filtered, allActivities }),
    [query, filtered, allActivities],
  );
};
