import { useQuery, useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect, useState } from 'react';
import { getGrievanceClient } from '@rahataid/sdk/clients/grievance.client';

export const useGrievanceList = (payload: Pagination) => {
  const { queryClient, rumsanService } = useRSQuery();
  const [isFetched, setIsFetched] = useState(false);

  const grievanceClient = getGrievanceClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: ['get_grievances'],
      queryFn: async () => grievanceClient.list(payload),
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isFetched) {
      setIsFetched(true);
    }
  }, [query.isFetched]);

  return query;
};
