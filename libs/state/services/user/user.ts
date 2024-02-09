import queryString from 'query-string';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '../../../utils/api';
import { TAGS } from '../../const/const';
import {
  CreateNewUserPayload,
  EditUserPayload,
  GetUsers,
} from '../../../types/users.types';

const createNewUser = async (payload: CreateNewUserPayload) => {
  const res = await api.post('/users', payload);
  return res.data;
};

const userCreateMutation = (payload: CreateNewUserPayload) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => createNewUser(payload),
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

const editUser = async (payload: EditUserPayload) => {
  const response = await api.patch('/users/me', payload);
  return response.data;
};

const userEditMutation = (payload: EditUserPayload) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => editUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_USER] });
    },
  });
};

export { useUserListQuery, userCreateMutation, userQuery, userEditMutation };
