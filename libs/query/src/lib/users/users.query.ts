import { useRSQuery } from '@rumsan/react-query';
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { getUserClient } from '@rumsan/sdk/clients';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';
import { User } from '@rumsan/sdk/types';

export const useRoleList = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const query = useQuery(
    {
      queryKey: ['get_all_roles'],
      queryFn: () => rumsanService.role.listRole(),
    },
    queryClient,
  );
  return query;
};

export const useUserCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: ['create_user'],
      mutationFn: userClient.createUser,
      onSuccess: () => {
        Swal.fire('Users Added Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            'get_all_user',
            {
              exact: true,
            },
          ],
        });
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

export const useUsersList = (payload: any): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: ['get_all_user', payload],
      queryFn: () => rumsanService.user.listUsers(payload),
    },
    queryClient,
  );

  return query;
};

export const useUserUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: ['update_user', 'uuid'],
      mutationFn: ({ uuid, payload }: { uuid: UUID; payload: User }) =>
        userClient.updateUser(uuid, payload),
      onSuccess: () => {
        Swal.fire('Users Updated Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            'get_all_user',
            {
              exact: true,
            },
          ],
        });
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
