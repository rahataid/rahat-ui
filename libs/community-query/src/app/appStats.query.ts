import { FilterStatsDto } from '@rahataid/community-tool-sdk/app';
import { getAppClient } from '@rahataid/community-tool-sdk/clients';
import { useQuery, useRSQuery } from '@rumsan/react-query';
import { TAGS } from '../config';

export const useAppStatsList = (data?: FilterStatsDto) => {
  const { queryClient, rumsanService } = useRSQuery();
  const appStatsClient = getAppClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.GET_DASHBOARD, data],
      queryFn: () => appStatsClient.getAppStats(data),
    },
    queryClient,
  );
  return query;
};
