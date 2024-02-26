import {
  PaginatedRequestPayload,
  CreateRolePayload,
  EditRolePayload,
  DeleteRolePayload,
} from '@rahat-ui/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { TAGS } from '../../config';
import { createApiInstance } from '../../utils/api';

const baseURL = process.env['NEXT_PUBLIC_API_HOST_URL'];

const api = createApiInstance(baseURL || '');

const createNewRole = async (payload: CreateRolePayload) => {
  const res = await api.post('/roles', payload);
  return res.data;
};

const useCreateRoleMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createNewRole(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_ROLES] });
    },
  });
};

const listRole = async (payload: PaginatedRequestPayload) => {
  const searchParams = queryString.stringify({
    page: payload.page,
    perPage: payload.perPage,
    sort: payload.sort,
    order: payload.order,
  });
  const response = await api.get('/roles?' + searchParams);
  return response.data;
};

const useListRoleQuery = (
  payload: PaginatedRequestPayload
): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_ROLES],
    queryFn: () => listRole(payload),
  });
};

const editRole = async (payload: EditRolePayload) => {
  const response = await api.patch(`/roles/${payload.name}`, payload);
  return response.data;
};

const useEditRoleMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditRolePayload) => editRole(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_ROLES] });
    },
  });
};

const deleteRole = async (payload: DeleteRolePayload) => {
  const response = await api.delete(`/roles/${payload.name}`);
  return response.data;
};

const useDeleteRoleMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteRolePayload) => deleteRole(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_ROLES] });
    },
  });
};

export {
  useCreateRoleMutation,
  useListRoleQuery,
  useDeleteRoleMutation,
  useEditRoleMutation,
};
