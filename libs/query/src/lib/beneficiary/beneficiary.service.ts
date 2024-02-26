import queryString from 'query-string';
import api from '../../utils/api';
import {
  PaginatedRequestPayload,
  ListBeneficiariesResponse,
  CreateNewBeneficiaryPayload,
  ApiResponse,
  UpdateBeneficiaryPayload,
  UploadedFile,
} from '@rahat-ui/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAGS } from '../../config';

const createNewBeneficiary = async (payload: CreateNewBeneficiaryPayload) => {
  const response = await api.post('/beneficiaries', payload);
  return response?.data;
};

const useCreateBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNewBeneficiaryPayload) =>
      createNewBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

const beneficiaryListQuery = async (payload: PaginatedRequestPayload) => {
  const searchParams = queryString.stringify({
    page: payload.page,
    perPage: payload.perPage,
    sort: payload.sort,
    order: payload.order,
  });
  const response = await api.get(`/beneficiaries?${searchParams}`);
  return response?.data;
};

const usebeneficiaryListQuery = (
  payload: PaginatedRequestPayload
): UseQueryResult<ListBeneficiariesResponse, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_BENEFICIARIES],
    queryFn: () => beneficiaryListQuery(payload),
  });
};

const listBeneficiaryStatus = async () => {
  const response = await api.get('/beneficiaries/stats');
  return response?.data;
};

const useListBeneficiaryStatus = (): UseQueryResult<ApiResponse, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_BENEFICIARIES_STATUS],
    queryFn: () => listBeneficiaryStatus(),
  });
};

const updateBeneficiary = async (payload: UpdateBeneficiaryPayload) => {
  const response = await api.patch(`/beneficiaries/${payload.uuid}`, payload);
  return response?.data;
};

const useUpdateBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBeneficiaryPayload) =>
      updateBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

const addBulkBeneficiary = async (payload: CreateNewBeneficiaryPayload[]) => {
  const response = await api.post('/beneficiaries/bulk', payload);
  return response?.data;
};

const useAddBulkBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNewBeneficiaryPayload[]) =>
      addBulkBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

const uploadBeneficiary = async (file: UploadedFile) => {
  const response = await api.post('/beneficiaries/upload', file);
  return response?.data;
};

const useUploadBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: UploadedFile) => uploadBeneficiary(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};
export {
  usebeneficiaryListQuery,
  useCreateBeneficiaryMutation,
  useListBeneficiaryStatus,
  useUpdateBeneficiaryMutation,
  useAddBulkBeneficiaryMutation,
  useUploadBeneficiaryMutation,
};
