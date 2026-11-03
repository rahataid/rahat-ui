import { useMemo } from 'react';
import { getProjectClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { TAGS } from '../../config';
import { useProjectList } from '../projects';
import {
  CommunicationActivityItem,
  CommunicationLogsFilterParams,
  GroupTransportStats,
  TargetProject,
} from './communication-overview.types';
import { EMPTY_ACTIVITIES } from './communication-overview.utils';

const STALE_5MIN = 5 * 60 * 1000;
const EMPTY_PROJECTS: Array<{ uuid?: string; name?: string }> = [];

export const useCommunicationOverviewActivities = (
  params?: CommunicationLogsFilterParams,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectList();
  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const backendRecipient = useMemo(() => {
    return params?.recipient && params.recipient !== 'all'
      ? params.recipient.toUpperCase()
      : undefined;
  }, [params?.recipient]);

  const backendPhase = useMemo(() => {
    return params?.phase && params.phase !== 'all' ? params.phase : undefined;
  }, [params?.phase]);

  const baseQueryKey = useMemo(
    () => [
      TAGS.COMMUNICATION_OVERVIEW.LIST_COMMUNICATION_ACTIVITIES,
      params?.project || 'all',
      backendRecipient || 'all',
      params?.channel || 'all',
      params?.from || 'all',
      params?.to || 'all',
      backendPhase || 'all',
      params?.search?.trim() || 'all',
      params?.page || 1,
      params?.perPage || 10,
    ],
    [
      params?.project,
      backendRecipient,
      params?.channel,
      params?.from,
      params?.to,
      backendPhase,
      params?.search,
      params?.page,
      params?.perPage,
    ],
  );

  const query = useQuery<{ items: CommunicationActivityItem[]; meta: any }, Error>(
    {
      queryKey: baseQueryKey,
      enabled: !isLoadingProjects && projectList.length > 0,
      queryFn: async () => {
        const isSingleProject = Boolean(params?.project && params.project !== 'all');
        const singleUuid = isSingleProject ? (params?.project as UUID) : undefined;
        const foundProject = isSingleProject
          ? projectList.find((p) => p.uuid === params?.project)
          : undefined;
        const targetProject: TargetProject = {
          uuid: (foundProject?.uuid || singleUuid || 'all') as string,
          name: (foundProject?.name || (isSingleProject ? 'Project' : 'All Projects')) as string,
        };

        const projectMap = new Map(
          projectList
            .filter((p) => p?.uuid)
            .map((p) => [p.uuid as string, p.name || (p.uuid as string)]),
        );

        const effectiveLimit = Number(params?.perPage) > 0 ? Number(params?.perPage) : 10;
        const effectivePage = Number(params?.page) > 0 ? Number(params?.page) : 1;

        const payload: Record<string, unknown> = {
          appId: singleUuid || 'all',
          page: effectivePage,
          currentPage: effectivePage,
          perPage: effectiveLimit,
          limit: effectiveLimit,
          ...(params?.from && { startDate: params.from }),
          ...(params?.to && { endDate: params.to }),
          ...(backendPhase && { phase: backendPhase }),
          ...(backendRecipient && { recipient: backendRecipient }),
          ...(params?.channel && params.channel !== 'all' && { channel: params.channel }),
          ...(params?.search?.trim() && { search: params.search.trim() }),
        };

        const res = (singleUuid
          ? await projectClient.projectActions({
              uuid: singleUuid,
              data: {
                action: 'ms.communications.getOverview',
                payload,
              },
            })
          : await projectClient.generalActions({
              data: {
                action: 'ms.communications.getOverview',
                payload,
              },
            })) as Record<string, unknown>;

        const responseData =
          (res?.['data'] as Record<string, unknown> | undefined)?.['data'] ??
          res?.['data'] ??
          (res?.['response'] as Record<string, unknown> | undefined)?.['data'] ??
          [];

        const responseMeta =
          (res?.['data'] as Record<string, unknown> | undefined)?.['meta'] ??
          (res?.['response'] as Record<string, unknown> | undefined)?.['meta'] ??
          null;

        const rawList = Array.isArray(responseData) ? responseData : [];
        const items: CommunicationActivityItem[] = rawList.map((item: any) => ({
          ...item,
          projectName:
            (item.projectId && projectMap.get(item.projectId)) ||
            (targetProject.uuid !== 'all' ? targetProject.name : 'Project'),
        }));

        return { items, meta: responseMeta };
      },
      staleTime: STALE_5MIN,
    },
    queryClient,
  );

  const items = query.data?.items ?? EMPTY_ACTIVITIES;
  const meta = query.data?.meta ?? null;

  return useMemo(
    () => ({ ...query, data: items, meta, allActivities: items }),
    [query, items, meta],
  );
};

function unwrapGroupStats(res: unknown): GroupTransportStats | null {
  if (!res || typeof res !== 'object') return null;
  const r = res as Record<string, unknown>;
  const data =
    (r['data'] && typeof r['data'] === 'object' ? (r['data'] as Record<string, unknown>)['data'] ?? r['data'] : null) ??
    (r['response'] && typeof r['response'] === 'object' ? (r['response'] as Record<string, unknown>)['data'] : null) ??
    res;

  if (data && typeof data === 'object' && ('beneficiary' in data || 'stakeholder' in data)) {
    return data as GroupTransportStats;
  }
  return null;
}


export const useCommunicationOverviewGroupStats = (
  params?: {
    project?: string;
    from?: string;
    to?: string;
    phase?: string;
    source?: 'all' | 'activities' | 'communications';
  },
) => {
  const { rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  const { data: projectsData, isLoading: isLoadingProjects } = useProjectList();
  const projectList = projectsData?.data ?? EMPTY_PROJECTS;

  const queryKey = useMemo(
    () => [
      'COMMUNICATION_OVERVIEW_GROUP_STATS',
      params?.project || 'all',
      params?.from || 'all',
      params?.to || 'all',
      params?.phase || 'all',
      params?.source || 'all',
    ],
    [params?.project, params?.from, params?.to, params?.phase, params?.source],
  );

  return useQuery<GroupTransportStats | null, Error>({
    queryKey,
    enabled: !isLoadingProjects && projectList.length > 0,
    staleTime: STALE_5MIN,
    queryFn: async () => {
      const isSingleProject = Boolean(params?.project && params.project !== 'all');
      const filters: Record<string, unknown> = {};
      if (params?.phase && params.phase !== 'all') filters['phase'] = params.phase;
      filters['source'] = params?.source || 'all';

      const payload = {
        appId: isSingleProject ? params?.project : 'all',
        ...(params?.from && { startDate: params.from }),
        ...(params?.to && { endDate: params.to }),
        ...(Object.keys(filters).length > 0 && { filters }),
      };

      try {
        const res = isSingleProject
          ? await projectClient.projectActions({
              uuid: params?.project as UUID,
              data: {
                action: 'ms.triggers.getTransportSessionStatsByGroup',
                payload,
              },
            })
          : await projectClient.generalActions({
              data: {
                action: 'ms.triggers.getTransportSessionStatsByGroup',
                payload,
              },
            });

        return unwrapGroupStats(res);
      } catch {
        return null;
      }
    },
  });
};
