'use client';
import { useQuery, useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect, useState } from 'react';
import { getGrievanceClient } from '@rahataid/sdk/clients/grievance.client';
import { useMutation } from '@tanstack/react-query';

export const useGrievanceList: any = (payload: Pagination) => {
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

export const useGrievanceAdd: any = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const grievanceClient = getGrievanceClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: ['add_grievance'],
      mutationFn: grievanceClient.create,
    },
    queryClient,
  );
};
