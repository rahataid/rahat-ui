'use client';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { TAGS } from '../../config';

export type ServiceVersion = {
  version: string;
  env: string | null;
  projectId?: string;
};

export type AppVersions = {
  platform: ServiceVersion;
  rahatAa: ServiceVersion;
  triggers: ServiceVersion;
  fetchedAt: string;
};

export type ProjectEnvironment = {
  projectId: string;
  env: string | null;
};

export function useAppVersions(
  projectId: UUID,
): UseQueryResult<ProjectEnvironment, Error>;
export function useAppVersions(
  projectId?: undefined,
): UseQueryResult<AppVersions, Error>;
export function useAppVersions(projectId?: UUID): UseQueryResult<any, Error>;
export function useAppVersions(projectId?: UUID): UseQueryResult<any, Error> {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: projectId
        ? [TAGS.GET_APP_VERSIONS, projectId]
        : [TAGS.GET_APP_VERSIONS],
      queryFn: async () => {
        const url = projectId
          ? `/app/versions?projectId=${projectId}`
          : '/app/versions';
        return (await rumsanService.client.get(url)).data.data;
      },
    },
    queryClient,
  );
}
