import { getAppClient } from '@rahataid/community-tool-sdk/clients';
import { useQuery, useRSQuery } from '@rumsan/react-query';
import { TAGS } from '../config';
import { FilterStatsDto } from '@rahataid/community-tool-sdk/app';

export const useAppStatsList = (data?: FilterStatsDto) => {
  const { queryClient, rumsanService } = useRSQuery();
  const appStatsClient = getAppClient(rumsanService.client);
  console.log('query', data);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_DASHBOARD, data],
      queryFn: () => appStatsClient.getAppStats(data),
    },
    queryClient,
  );
  return query;
};