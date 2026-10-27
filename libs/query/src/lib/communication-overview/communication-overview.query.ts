import { useMemo } from 'react';
import { getProjectClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { TAGS } from '../../config';
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
  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const backendRecipient = useMemo(() => {
    return params?.recipient && params.recipient !== 'all'
      ? params.recipient.toUpperCase()
      : undefined;
  }, [params?.recipient]);

  const backendTransportId = useMemo(() => {
    if (!params?.channel || params.channel === 'all' || !Array.isArray(appTransports)) return undefined;
    const targetChannel = classifyTransportString(params.channel);
    const match = appTransports.find(
      (t) => t && classifyTransportString(t.name || t.type || '') === targetChannel,
    );
    return match?.cuid || match?.id || undefined;
  }, [params?.channel, appTransports]);

  const backendPhase = useMemo(() => {
    return params?.phase && params.phase !== 'all' ? params.phase : undefined;
  }, [params?.phase]);

  const baseQueryKey = useMemo(
    () => [
      TAGS.COMMUNICATION_OVERVIEW.LIST_COMMUNICATION_ACTIVITIES,
      params?.project || 'all',
      backendRecipient || 'all',
      backendTransportId || 'all',
      params?.from || 'all',
      params?.to || 'all',
      backendPhase || 'all',
    ],
    [
      params?.project,
      backendRecipient,
      backendTransportId,
      params?.from,
      params?.to,
      backendPhase,
    ],
  );

  const query = useQuery<CommunicationActivityItem[], Error>(
    {
      queryKey: baseQueryKey,
      enabled: !isLoadingProjects && projectList.length > 0,
      queryFn: async () => {
        const targets = buildTargetProjects(projectList, params?.project);
        if (!targets.length) return [];

        let rows: CommunicationActivityItem[] = [];
        let commRows: CommunicationActivityItem[] = [];

        for (const proj of targets) {
          const projUuid = proj.uuid as UUID;
          await Promise.allSettled([
            // 1. Fetch Anticipatory Action / Activity-based communications
            (async () => {
              const activities = await fetchPaginatedProjectAction<Record<string, unknown>>(
                projectClient,
                projUuid,
                'ms.activities.getHavingComms',
                {
                  ...(params?.from && { startDate: params.from }),
                  ...(params?.to && { endDate: params.to }),
                  ...(backendPhase && {
                    filters: {
                      phase: backendPhase,
                    },
                  }),
                },
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
                  ...(params?.from && { startDate: params.from }),
                  ...(params?.to && { endDate: params.to }),
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
        }

        // Deduplicate communications created through activities, preserving phase info
        const phaseByCommId = new Map<string, string>();
        const phaseBySessionId = new Map<string, string>();
        for (const act of rows) {
          if (act.phase && act.phase.toUpperCase() !== 'N/A') {
            if (act.communicationId) phaseByCommId.set(act.communicationId, act.phase);
            if (act.sessionId) phaseBySessionId.set(act.sessionId, act.phase);
          }
        }
        for (const comm of commRows) {
          if (!comm.phase || comm.phase.toUpperCase() === 'N/A') {
            const preservedPhase =
              (comm.communicationId ? phaseByCommId.get(comm.communicationId) : undefined) ||
              (comm.sessionId ? phaseBySessionId.get(comm.sessionId) : undefined);
            if (preservedPhase) {
              comm.phase = preservedPhase;
            }
          }
        }

        if (backendPhase) {
          commRows = commRows.filter(
            (c) =>
              c.phase &&
              c.phase.toUpperCase() !== 'N/A' &&
              c.phase.toLowerCase() === backendPhase.toLowerCase(),
          );
        }

        if (backendRecipient) {
          rows = rows.filter(
            (r) =>
              typeof r.recipientType === 'string' &&
              r.recipientType.toUpperCase().includes(backendRecipient),
          );
        }

        if (params?.channel && params.channel !== 'all') {
          const targetChannel = classifyTransportString(params.channel);
          rows = rows.filter(
            (r) => classifyTransportString(r.channel) === targetChannel,
          );
          commRows = commRows.filter(
            (c) => classifyTransportString(c.channel) === targetChannel,
          );
        }

        const seenCommIds = new Set(commRows.map((c) => c.communicationId).filter(Boolean));
        const seenSessionIds = new Set(commRows.map((c) => c.sessionId).filter(Boolean));

        const dedupedActivities = rows.filter(
          (act) =>
            (!act.communicationId || !seenCommIds.has(act.communicationId)) &&
            (!act.sessionId || !seenSessionIds.has(act.sessionId)),
        );

        const allRows = [...dedupedActivities, ...commRows];

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
