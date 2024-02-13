import queryString from 'query-string';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '@/libs/utils/api';
import { TAGS } from '@/libs/state/const/const';
import {
  CreateNewUserPayload,
  DeleteUserPayload,
  EditUserPayload,
  GetUsers,
} from '@/libs/types/users.types';

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

const useUserListQuery = (payload: GetUsers) => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_USER],
    queryFn: () => userListQuery(payload),
  });
};

const getUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

const userQuery = () => {
  return useQuery({
    queryKey: [TAGS.GET_USER],
    queryFn: () => getUser(),
  });
};

const getUserByUuid = async (payload: { uuid: string }) => {
  const response = await api.get(`/users/${payload.uuid}`);
  return response.data;
};

const userByUuidQuery = (payload: { uuid: string }) => {
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
  userCreateMutation,
  userQuery,
  userEditMutation,
  userDeleteMutation,
  userByUuidQuery,
};
