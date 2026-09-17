'use client';
import { useRSQuery } from '@rumsan/react-query';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TAGS } from '../../config';

export type ServiceVersion = {
  version: string;
  env: string | null;
};

export type AppVersions = {
  platform: ServiceVersion;
  rahatAa: ServiceVersion;
  triggers: ServiceVersion;
  fetchedAt: string;
};

export const useAppVersions = (): UseQueryResult<AppVersions, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery({
    queryKey: [TAGS.GET_APP_VERSIONS],
    queryFn: async () => (await rumsanService.client.get('/app/versions')).data.data,
  }, queryClient);
};

