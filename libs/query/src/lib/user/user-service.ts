import {
  CreateNewUserPayload,
  DeleteUserPayload,
  EditUserPayload,
  GetUsers,
  ListUserResponse,
  User,
} from '@rahat-ui/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { useEffect } from 'react';
import { TAGS } from '../../config';
import api from '../../utils/api';
import { useUserStore } from './user-store';

const createNewUser = async (payload: CreateNewUserPayload) => {
  const res = await api.post('/users', payload);
  return res.data;
};

const userCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNewUserPayload) => createNewUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_USER] });
    },
  });
};

const userListQuery = async (payload: GetUsers) => {
  const searchParams = queryString.stringify({
    page: payload.page,
    perPage: payload.perPage,
    sort: payload.sort,
    order: payload.order,
  });
  const response = await api.get('/users?' + searchParams);
  return response.data;
};

const useUserListQuery = (
  payload: GetUsers
): UseQueryResult<ListUserResponse, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_USER],
    queryFn: () => userListQuery(payload),
  });
};

const getUser = async () => {
  const response = await api.get('/users/me');
  return response.data as User;
};

export const useGetCurrentUser = (
  enabled: boolean
): UseQueryResult<User, Error> => {
  const userStore = useUserStore();

  const userQuery = useQuery({
    queryKey: [TAGS.GET_USER],
    queryFn: () => getUser(),
    enabled,
    initialData: userStore.user,
  });

  useEffect(() => {
    if (userQuery.data) {
      userStore.setUser(userQuery.data.data);
    }
  }, [userQuery.data]);

  return userQuery?.data?.data;
};

const getUserByUuid = async (payload: { uuid: string }): Promise<User> => {
  const response = await api.get(`/users/${payload.uuid}`);
  return response.data as User;
};

const userByUuidQuery = (payload: {
  uuid: string;
}): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_USER],
    queryFn: () => getUserByUuid(payload),
  });
};

const editUser = async (payload: EditUserPayload) => {
  const response = await api.patch(`/users/${payload.uuid}`, payload);
  return response.data;
};

const userEditMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditUserPayload) => editUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_USER] });
    },
  });
};

const deleteUser = async (payload: DeleteUserPayload) => {
  const response = await api.delete(`/users/${payload.uuid}`);
  return response.data;
};

const userDeleteMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteUserPayload) => deleteUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_USER] });
    },
  });
};

export {
  useUserListQuery,
  userByUuidQuery,
  userCreateMutation,
  userDeleteMutation,
  userEditMutation,
};

