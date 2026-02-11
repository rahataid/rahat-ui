import { useRSQuery } from '@rumsan/react-query';
import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { getRoleClient, getUserClient } from '@rumsan/sdk/clients';
import Swal from 'sweetalert2';
import { UUID } from 'crypto';
import { ListRole, User } from '@rumsan/sdk/types';

// export const useRoleList = (): any => {
//   const { queryClient, rumsanService } = useRSQuery();
//   const query = useQuery(
//     {
//       queryKey: ['get_all_roles'],
//       queryFn: () => rumsanService.role.listRole(),
//     },
//     queryClient,
//   );
//   return query;
// };

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
        const errorMessage = error.response.data.message.includes(
          'Unique constraint failed',
        )
          ? 'User already exist'
          : error.response.data.message;
        Swal.fire(
          'Error',
          errorMessage || 'Encounter error on Creating Data',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useUsersList = (payload: any): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const query = useQuery(
    {
      queryKey: ['get_all_user', payload],
      queryFn: () => rumsanService.user.listUsers(payload),
      staleTime: 10 * 60 * 1000, // 10 min
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

export const useRoleList = (payload?: ListRole): any => {
  const { queryClient, rumsanService } = useRSQuery();
  const query = useQuery(
    {
      queryKey: ['get_all_roles'],
      queryFn: () => rumsanService.role.listRole(payload),
      staleTime: 10 * 60 * 1000, // 10 min
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
      mutationKey: ['create_role'],
      mutationFn: roleClient.createRole,
      onSuccess: () => {
        Swal.fire('Roles Added Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            'get_all_roles',
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

export const useEditRole = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getRoleClient(rumsanService.client);
  const query = useMutation(
    {
      mutationKey: ['edit_role'],

      mutationFn: ({ name, data }: { name: string; data: any }) =>
        roleClient.updateRole(name, data),
      onSuccess: () => {
        Swal.fire('Role Updated Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            'get_all_roles',
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

export const useGetRole = (name: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getRoleClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: ['get_role', name],
      queryFn: () => roleClient.getRole(name),
    },
    queryClient,
  );
  return query;
};

export const useDeleteRole = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getRoleClient(rumsanService.client);
  const query = useMutation(
    {
      mutationKey: ['delete_role'],

      mutationFn: ({ name }: { name: string }) => roleClient.deleteRole(name),
      onSuccess: () => {
        Swal.fire('Role Deleted Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            'get_all_roles',
            {
              exact: true,
            },
          ],
        });
      },
      onError: (error: any) => {
        Swal.fire(
          'Error',
          error.response.data.message || 'Encounter error on Deleting Data',
          'error',
        );
      },
    },
    queryClient,
  );
  return query;
};
