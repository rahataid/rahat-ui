import {
  getAppClient,
  getSourceClient,
} from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';

export const useFetchKoboSettings = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const myClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_KOBO_SETTINGS],
      queryFn: () => myClient.listKoboSettings(),
    },

    queryClient,
  );
};

export const useExistingFieldMappings = (
  importId: string,
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const sourceClient = getSourceClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_MAPPINGS_BY_IMPORT_ID],
      queryFn: () => sourceClient.importIdMapping(importId),
    },

    queryClient,
  );
};
