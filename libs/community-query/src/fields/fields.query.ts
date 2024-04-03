import { getFieldDefinitionClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';

export const useActiveFieldDefinitionsList = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const fdClient = getFieldDefinitionClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.LIST_ACTIVE_FIELD_DEFINITIONS],
      queryFn: () => fdClient.listActive(),
    },
    queryClient,
  );

  return query;
};
