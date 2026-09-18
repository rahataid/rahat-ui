'use client';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { HEALTH_CHECK_ACTION, TAGS } from '../../config';
import { useProjectAction } from '../..';
import { UUID } from 'crypto';


export interface CoreServiceStatus {
  status: 'up' | 'down';
  message?: string;
  latency?: string;
  last_checked?: string;
  notes?: string | Record<string, any>;
  link?: string;
}

export interface CoreHealthStatus {
  /** Backend aggregate ('degraded' = DB or Redis down). Unused: it ignores other services, so the UI derives overall status from the rows instead. */
  status: 'up' | 'degraded';
  /** Left open rather than a fixed key set so backend-added services surface automatically. */
  services: Record<string, CoreServiceStatus>;
}

// GET /v1/health on rahat-platform — apps/rahat/src/health/health.controller.ts.
export const useCoreHealth = (): UseQueryResult<CoreHealthStatus, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: [TAGS.GET_CORE_HEALTH],
      // Global interceptor wraps responses in { success, data } — unwrap one extra level.
      queryFn: async () => (await rumsanService.client.get('/health')).data.data,
      refetchInterval: 60_000,
    },
    queryClient,
  );
};

export type ProjectHealthStatus = CoreHealthStatus;

export const useProjectHealthCheck = (projectId: UUID, enabled = true) => {
  const { queryClient } = useRSQuery();
  // Mutation key stays stable; projectId belongs in the queryKey, not here.
  const q = useProjectAction<ProjectHealthStatus>([TAGS.GET_PROJECT_HEALTH]);

  return useQuery(
    {
      queryKey: [TAGS.GET_PROJECT_HEALTH, projectId],
      enabled: !!projectId && enabled,
      staleTime: 60_000,
      retry: false,
      queryFn: async () => {
        const res = await q.mutateAsync({
          uuid: projectId,
          data: { action: HEALTH_CHECK_ACTION, payload: {} },
        });
        const data = (res as any).data ?? res;
        return data as ProjectHealthStatus;
      },
    },
    queryClient,
  );
};