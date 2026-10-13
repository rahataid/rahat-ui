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
  CommunicationOverviewData,
  GroupTransportStats,
  TransportEntry,
} from './communication-overview.types';
import {
  buildTargetProjects,
  computeOverviewStats,
  computeStatsFromActivities,
  EMPTY_ACTIVITIES,
  EMPTY_PROJECTS,
  filterCommunicationActivities,
  mergeTransportStats,
  STALE_5MIN,
  transformActivitiesToCommunicationRows,
  unwrapGroupStats,
} from './communication-overview.utils';

export * from './communication-overview.types';
export * from './communication-overview.utils';

export const useCommunicationOverviewStats = (
  params?: CommunicationLogsFilterParams,
  fallbackActivities?: CommunicationActivityItem[],
) => {
  const fallbackStats = useMemo(
    () => (fallbackActivities ? computeStatsFromActivities(fallbackActivities) : undefined),
    [fallbackActivities],
  );

  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectList();
  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const queryPayload = useMemo(
    () =>
      JSON.stringify({
        project: params?.project,
        from: params?.from,
        to: params?.to,
        phase: params?.phase,
        channel: params?.channel,
        recipient: params?.recipient,
        projectsCount: projectList.length,
      }),
    [
      params?.project,
      params?.from,
      params?.to,
      params?.phase,
      params?.channel,
      params?.recipient,
      projectList.length,
    ],
  );

  const query = useQuery<CommunicationOverviewData, Error>(
    {
      queryKey: [TAGS.COMMUNICATION_OVERVIEW.GET_OVERVIEW_STATS, queryPayload],
      enabled: !isLoadingProjects && projectList.length > 0,
      queryFn: async () => {
        const targets = buildTargetProjects(projectList, params?.project);
        if (!targets.length) return computeOverviewStats({}, params);

        let aggregated: GroupTransportStats = {
          beneficiary: {},
          stakeholder: {},
        };

        const results = await Promise.allSettled(
          targets.map(async (proj) => {
            try {
              const res = await projectClient.projectActions({
                uuid: proj.uuid as UUID,
                data: {
                  action: 'ms.triggers.getTransportSessionStatsByGroup',
                  payload: {
                    ...(params?.from && {
                      startDate:
                        typeof params.from === 'string'
                          ? params.from
                          : new Date(params.from).toISOString(),
                    }),
                    ...(params?.to && {
                      endDate:
                        typeof params.to === 'string'
                          ? params.to
                          : new Date(params.to).toISOString(),
                    }),
                    ...(params?.phase && { filters: { phase: params.phase } }),
                  },
                },
              });

              return unwrapGroupStats(res);
            } catch {
              return null;
            }
          }),
        );

        for (const r of results) {
          if (r.status === 'fulfilled' && r.value) {
            aggregated = mergeTransportStats(aggregated, r.value);
          }
        }

        return computeOverviewStats(aggregated, params);
      },
      staleTime: STALE_5MIN,
    },
    queryClient,
  );

  return useMemo(() => {
    if (query.data) return query;
    if (fallbackStats && !query.isLoading) {
      return { ...query, data: fallbackStats };
    }
    return query;
  }, [query, fallbackStats]);
};

export const useCommunicationOverviewActivities = (
  params?: CommunicationLogsFilterParams,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectList();
  const appTransports = useListAllTransports();

  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const baseQueryKey = useMemo(
    () => [
      TAGS.COMMUNICATION_OVERVIEW.LIST_COMMUNICATION_ACTIVITIES,
      params?.project || 'all',
      projectList.length,
      appTransports?.length ?? 0,
    ],
    [params?.project, projectList.length, appTransports?.length],
  );

  const query = useQuery<CommunicationActivityItem[], Error>(
    {
      queryKey: baseQueryKey,
      enabled: !isLoadingProjects && projectList.length > 0,
      queryFn: async () => {
        const targets = buildTargetProjects(projectList, params?.project);
        if (!targets.length) return [];

        const rows: CommunicationActivityItem[] = [];

        const PER_PAGE = 100;

        await Promise.allSettled(
          targets.map(async (proj) => {
            try {
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
                const responseObj = data?.[('response')] as Record<string, unknown> | undefined;
                const dataObj = data?.[('data')] as Record<string, unknown> | undefined;

                const meta = (
                  responseObj?.[('meta')] ??
                  dataObj?.[('meta')] ??
                  data?.[('meta')]
                ) as Record<string, unknown> | undefined;

                if (meta?.['lastPage']) {
                  lastPage = Number(meta['lastPage']);
                }

                const activities = (
                  responseObj?.[('data')] ??
                  dataObj?.[('data')] ??
                  data?.[('data')] ??
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
            } catch {
              // graceful per-project fallback
            }
          }),
        );

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
