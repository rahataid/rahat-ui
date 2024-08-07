import { getAppClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';
export const useCreateAuthApp = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: ['CREATE_AUTH_APP'],
      mutationFn: appClient.createAuthApp,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'LIST_AUTH_APPS',
            {
              exact: true,
            },
          ],
        });
        Swal.fire('Auth App Create Sucessfully', '', 'success');
      },
      onError: (error: any) => {
        Swal.fire(
          'Error',
          error.response.data.message || 'Encounter error on Creating Data',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const listAuthApps = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: ['LIST_AUTH_APPS', payload],
      queryFn: () => appClient.listAuthApps(payload),
    },
    queryClient,
  );
};

export const getAuthApp = (uuid: UUID): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const appClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: ['GET_AUTH_APP', uuid],
      queryFn: () => appClient.getAuthApp(uuid),
    },
    queryClient,
  );
};
