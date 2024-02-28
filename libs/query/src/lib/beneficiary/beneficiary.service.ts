import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAGS } from '../../config';
import { api } from '../../utils/api';

const createNewBeneficiary = async (payload: any) => {
  const response = await api.post('/beneficiaries', payload);
  return response?.data;
};

const useCreateBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createNewBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

const beneficiaryListQuery = async (payload: any) => {
  const searchParams = {
    page: payload.page,
    perPage: payload.perPage,
    sort: payload.sort,
    order: payload.order,
  };
  const response = await api.get(`/beneficiaries`, { params: searchParams });
  return response?.data;
};

const usebeneficiaryListQuery = (payload: any): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_BENEFICIARIES],
    queryFn: () => beneficiaryListQuery(payload),
  });
};

const listBeneficiaryStatus = async () => {
  const response = await api.get('/beneficiaries/stats');
  return response?.data;
};

const useListBeneficiaryStatus = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_BENEFICIARIES_STATUS],
    queryFn: () => listBeneficiaryStatus(),
  });
};

const updateBeneficiary = async (payload: any) => {
  const response = await api.patch(`/beneficiaries/${payload.uuid}`, payload);
  return response?.data;
};

const useUpdateBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => updateBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

const addBulkBeneficiary = async (payload: any[]) => {
  const response = await api.post('/beneficiaries/bulk', payload);
  return response?.data;
};

const useAddBulkBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any[]) => addBulkBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

const uploadBeneficiary = async (file: any) => {
  const response = await api.post('/beneficiaries/upload', file);
  return response?.data;
};

const useUploadBeneficiaryMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: any) => uploadBeneficiary(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

export {
  useAddBulkBeneficiaryMutation,
  useCreateBeneficiaryMutation,
  useListBeneficiaryStatus,
  useUpdateBeneficiaryMutation,
  useUploadBeneficiaryMutation,
  usebeneficiaryListQuery,
};
