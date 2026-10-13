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
  resolveCommRowsFromAggregate,
  STALE_5MIN,
  transformActivitiesToCommunicationRows,
  transformCommunicationsToCommunicationRows,
} from './communication-overview.utils';

export * from './communication-overview.types';
export * from './communication-overview.utils';


export const useCommunicationOverviewActivities = (
  params?: CommunicationLogsFilterParams,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectList();
  const appTransports = useListAllTransports();
  const { newCommunicationService } = useNewCommunicationQuery();

  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const backendRecipient = params?.recipient && params.recipient !== 'all' ? params.recipient.toUpperCase() : undefined;

  const backendTransportId = useMemo(() => {
    if (!params?.channel || params.channel === 'all' || !Array.isArray(appTransports)) return undefined;
    const targetChannel = classifyTransportString(params.channel);
    const match = appTransports.find((t) => t && classifyTransportString(t.name || t.type || '') === targetChannel);
    return match?.cuid || undefined;
  }, [params?.channel, appTransports]);

  const baseQueryKey = useMemo(
    () => [
      TAGS.COMMUNICATION_OVERVIEW.LIST_COMMUNICATION_ACTIVITIES,
      params?.project || 'all',
      projectList.length,
      appTransports?.length ?? 0,
      backendRecipient || 'all',
      backendTransportId || 'all',
    ],
    [params?.project, projectList.length, appTransports?.length, backendRecipient, backendTransportId],
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
        const PER_PAGE = 100;

        await Promise.allSettled(
          targets.map(async (proj) => {
            await Promise.allSettled([
              (async () => {
                let page = 1;
                let lastPage = 1;

                while (page <= lastPage) {
                  const res = await projectClient.projectActions({
                    uuid: proj.uuid as UUID,
                    data: {
                      action: 'ms.activities.getHavingComms',
                      payload: { perPage: PER_PAGE, page },
                    },
                  });

                  const data = res as Record<string, unknown>;
                  const responseObj = data?.['response'] as Record<string, unknown> | undefined;
                  const dataObj = data?.['data'] as Record<string, unknown> | undefined;

                  const meta = (
                    responseObj?.['meta'] ??
                    dataObj?.['meta'] ??
                    data?.['meta']
                  ) as Record<string, unknown> | undefined;

                  if (meta?.['lastPage']) {
                    lastPage = Number(meta['lastPage']);
                  }

                  const activities = (
                    responseObj?.['data'] ??
                    dataObj?.['data'] ??
                    data?.['data'] ??
                    []
                  ) as Record<string, unknown>[];

                  if (Array.isArray(activities) && activities.length > 0) {
                    rows.push(
                      ...transformActivitiesToCommunicationRows(
                        activities,
                        proj,
                        appTransports as TransportEntry[],
                      ),
                    );
                    page++;
                  } else {
                    break;
                  }
                }
              })(),

              (async () => {
                let page = 1;
                let lastPage = 1;

                while (page <= lastPage) {
                  const res = await projectClient.projectActions({
                    uuid: proj.uuid as UUID,
                    data: {
                      action: 'ms.communications.getAll',
                      payload: {
                        perPage: PER_PAGE,
                        page,
                        xrefId: proj.uuid,
                        ...(backendRecipient && { groupType: backendRecipient }),
                        ...(backendTransportId && { transportId: backendTransportId }),
                      },
                    },
                  });

                  const data = res as Record<string, unknown>;
                  const responseObj = data?.['response'] as Record<string, unknown> | undefined;
                  const dataObj = data?.['data'] as Record<string, unknown> | undefined;

                  const meta = (
                    responseObj?.['meta'] ??
                    dataObj?.['meta'] ??
                    data?.['meta']
                  ) as Record<string, unknown> | undefined;

                  if (meta?.['lastPage']) {
                    lastPage = Number(meta['lastPage']);
                  }

                  const communications = (
                    responseObj?.['data'] ??
                    dataObj?.['data'] ??
                    data?.['data'] ??
                    []
                  ) as Record<string, unknown>[];

                  if (Array.isArray(communications) && communications.length > 0) {
                    commRows.push(
                      ...transformCommunicationsToCommunicationRows(
                        communications,
                        proj,
                        appTransports as TransportEntry[],
                      ),
                    );
                    page++;
                  } else {
                    break;
                  }
                }
              })(),
            ]);
          }),
        );

        if (commRows.length) {
          const sessionIds = newCommunicationService?.session
            ? [...new Set(commRows.map((r) => r.sessionId).filter(Boolean) as string[])]
            : [];

          if (sessionIds.length) {
            try {
              const res = await newCommunicationService.session.broadcastCount({
                sessions: sessionIds,
              });
              const aggregate = res?.data as Record<string, any> | undefined;
              if (aggregate && aggregate['TOTAL'] !== undefined) {
                resolveCommRowsFromAggregate(commRows, aggregate);
              }
            } catch { /* graceful fallback to dispatch status */ }
          }

          rows.push(...commRows);
        }

        rows.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        return rows;
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
