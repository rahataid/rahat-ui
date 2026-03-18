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
