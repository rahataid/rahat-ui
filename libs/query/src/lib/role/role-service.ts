import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { TAGS } from '../../config';
import api from '../../utils/api';

const createNewRole = async (payload: any) => {
  const res = await api.post('/roles', payload);
  return res.data;
};

const useCreateRoleMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createNewRole(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_ROLES] });
    },
  });
};

const listRole = async (payload: any) => {
  const searchParams = queryString.stringify({
    page: payload.page,
    perPage: payload.perPage,
    sort: payload.sort,
    order: payload.order,
  });
  const response = await api.get('/roles?' + searchParams);
  return response.data;
};

const useListRoleQuery = (payload: any): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_ROLES],
    queryFn: () => listRole(payload),
  });
};

const editRole = async (payload: any) => {
  const response = await api.patch(`/roles/${payload.name}`, payload);
  return response.data;
};

const useEditRoleMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => editRole(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_ROLES] });
    },
  });
};

const deleteRole = async (payload: any) => {
  const response = await api.delete(`/roles/${payload.name}`);
  return response.data;
};

const useDeleteRoleMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => deleteRole(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_ROLES] });
    },
  });
};

export {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useEditRoleMutation,
  useListRoleQuery,
};
