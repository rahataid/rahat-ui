import { useRSQuery } from '@rumsan/react-query';
import { ListRole, User } from '@rumsan/sdk/types';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import { getRoleClient, getUserClient } from '@rumsan/sdk/clients';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';

export const useCommunityUsersList = (
  payload: any,
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

export const useRoleList = (payload?: ListRole): any => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getUserClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_ALL_ROLES],
      queryFn: () => rumsanService.role.listRole(payload),
    },
    queryClient,
  );
  return query;
};

export const useCreateRole = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getRoleClient(rumsanService.client);
  const query = useMutation(
    {
      mutationKey: [TAGS.CREATE_ROLE],
      mutationFn: roleClient.createRole,
      onSuccess: () => {
        Swal.fire('Roles Added Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.GET_ALL_ROLES,
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
  return query;
};

// export const useEditRole = () => {
//   const { queryClient, rumsanService } = useRSQuery();
//   const roleClient = getRoleClient(rumsanService.client);
//   const query = useMutation(
//     {
//       mutationKey: [TAGS.EDIT_ROLE],
//       // mutationFn: ({ name, data }: { name: string; data: any }) =>
//       //   rumsanService.client.patch(`roles/${name}`, { ...data }),
//       mutationFn: ({ uuid, data }: { uuid: string; data: any }) =>
//         roleClient.updateRole(uuid, data),
//       onSuccess: () => {
//         Swal.fire('Role Updated Successfully', '', 'success');
//         queryClient.invalidateQueries({
//           queryKey: [
//             TAGS.GET_ALL_ROLES,
//             {
//               exact: true,
//             },
//           ],
//         });
//       },
//       onError: (error: any) => {
//         Swal.fire(
//           'Error',
//           error.response.data.message || 'Encounter error on Creating Data',
//           'error',
//         );
//       },
//     },
//     queryClient,
//   );
//   return query;
// };
