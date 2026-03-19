'use client';
import { getImportsClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { TAGS } from '../../config';

export const useListImports = (
  payload: Pagination & { [key: string]: string },
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const importsClient = getImportsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_IMPORTS, payload],
      queryFn: () => importsClient.list(payload),
    },
    queryClient,
  );
};

export const useGetImport = (
  uuid: UUID,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const importsClient = getImportsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_IMPORT, uuid],
      queryFn: () => importsClient.get(uuid),
      enabled: !!uuid,
    },
    queryClient,
  );
};

export const useGetImportFile = (
  uuid: UUID | undefined,
): UseQueryResult<string, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: [TAGS.GET_IMPORT_FILE, uuid],
      queryFn: async () => {
        const response = await rumsanService.client.get(
          `/imports/${uuid}/file`,
          { responseType: 'text' },
        );
        return response.data as string;
      },
      enabled: !!uuid,
    },
    queryClient,
  );
};
