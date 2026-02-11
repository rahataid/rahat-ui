import { useRSQuery } from '@rumsan/react-query';
import { getRoleClient, getUserClient } from '@rumsan/sdk/clients';
import { ListRole, User } from '@rumsan/sdk/types';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';
import Swal from 'sweetalert2';
import { TAGS } from '../config';

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
          Array.isArray(error?.response?.data?.message)
            ? error.response.data.message[0]
            : error.response.data.message,
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
      staleTime: 1000 * 60 * 5, // 5 minutes
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

export const useEditRole = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getRoleClient(rumsanService.client);
  const query = useMutation(
    {
      mutationKey: [TAGS.EDIT_ROLE],

      mutationFn: ({ name, data }: { name: string; data: any }) =>
        roleClient.updateRole(name, data),
      onSuccess: () => {
        Swal.fire('Role Updated Successfully', '', 'success');
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

export const useGetRole = (name: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const roleClient = getRoleClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_ROLE, name],
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
      mutationKey: [TAGS.DELETE_ROLE],

      mutationFn: ({ name }: { name: string }) => roleClient.deleteRole(name),
      onSuccess: () => {
        Swal.fire('Role Deleted Successfully', '', 'success');
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
          error.response.data.message || 'Encounter error on Deleting Data',
          'error',
        );
      },
    },
    queryClient,
  );
  return query;
};

export const useCurrentUser = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_ME, { exact: true }],
      queryFn: () => userClient.getMe(),
    },
    queryClient,
  );
  return query;
};

export const useUpdateMe = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const userClient = getUserClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_ME],
      mutationFn: ({ payload }: { payload: User }) =>
        userClient.updateMe(payload),
      onSuccess: () => {
        Swal.fire('Profile Updated Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.GET_ME,
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
