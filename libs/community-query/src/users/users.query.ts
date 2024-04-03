import { useRSQuery } from '@rumsan/react-query';
import { Pagination, User } from '@rumsan/sdk/types';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import { getUserClient } from '@rumsan/sdk/clients';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';

export const useCommunityUsersList = (
  payload: Pagination,
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_ALL_USER, payload],
      queryFn: () => rumsanService.user.listUsers(payload),
    },
    queryClient,
  );

  return query;
};
export const useCommunityUserCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.CREATE_USER],
      mutationFn: userClient.createUser,
      onSuccess: () => {
        Swal.fire('Users Added Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.GET_ALL_USER,
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

export const useCommunityUserUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_USER, 'uuid'],
      mutationFn: ({ uuid, payload }: { uuid: UUID; payload: User }) =>
        userClient.updateUser(uuid, payload),
      onSuccess: () => {
        Swal.fire('Users Updated Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.GET_ALL_USER,
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
