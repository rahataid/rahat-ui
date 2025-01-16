'use client';
import { useQuery, useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect, useState } from 'react';
import { getGrievanceClient } from '@rahataid/sdk/clients/grievance.client';
import { useMutation } from '@tanstack/react-query';
import { useSwal } from '../../swal';

export const useGrievanceList: any = (payload: Pagination) => {
  const { queryClient, rumsanService } = useRSQuery();
  const [isFetched, setIsFetched] = useState(false);

  const grievanceClient = getGrievanceClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: ['get_grievances', payload],
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
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationKey: ['add_grievance'],
    mutationFn: grievanceClient.create,
    onSuccess: () => {
      toast.fire({
        title: 'Grievance added successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['get_grievances'],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Error while creating grievance.',
        icon: 'error',
      });
    },
  });
};
export const useGrievanceChangeStatus: any = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const grievanceClient = getGrievanceClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: ['grievance_change_status'],
      mutationFn: grievanceClient.changeStatus,
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ['get_grievances'],
        });
      },
    },
    queryClient,
  );
};
