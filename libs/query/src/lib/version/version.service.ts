'use client';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../../config';

export type AppVersions = {
  platform: string;
  rahatAa: string;
  triggers: string;
  env: string;
  fetchedAt: string;
};

export const useAppVersions = (): UseQueryResult<AppVersions, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery({
    queryKey: [TAGS.GET_APP_VERSIONS],
    queryFn: async () => (await rumsanService.client.get('/app/versions')).data.data,
  }, queryClient);
};

export const useWebVersion = (): UseQueryResult<{ url: string; env: string }, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery({
    queryKey: [TAGS.GET_WEB_VERSION],
    queryFn: async () => (await rumsanService.client.get('/app/web-version')).data.data,
  }, queryClient);
};
