import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getTargetClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';

export const useTargetingList = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_TARGETING],
      queryFn: () => targetingClient.list(),
    },
    queryClient,
  );

  return query;
};
