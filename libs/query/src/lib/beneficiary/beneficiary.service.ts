import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAGS } from '../../config';
import { api } from '../../utils/api';
import { useRSQuery } from '@rumsan/react-query';
import { getBeneficiaryClient } from '@rahataid/sdk/clients';
import { useBeneficiaryStore } from './beneficiary.store';
import { useEffect } from 'react';

const createNewBeneficiary = async (payload: any) => {
  const response = await api.post('/beneficiaries', payload);
  return response?.data;
};

export const useCreateBeneficiary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createNewBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

export const useBeneficiaryList = (
  payload: any,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  const { setBeneficiaries, setMeta } = useBeneficiaryStore((state) => ({
    setBeneficiaries: state.setBeneficiaries,
    setMeta: state.setMeta,
  }));

  const ben = useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARIES],
      queryFn: () => benClient.list(payload),
    },
    queryClient,
  );

  useEffect(() => {
    if (ben.data) {
      //TODO: fix this type @karun-rumsan
      setBeneficiaries(ben.data.data as any[]);
      setMeta(ben.data.response.meta);
    }
  }, [ben.data, setBeneficiaries]);

  return ben;
};

const listBeneficiaryStatus = async () => {
  const response = await api.get('/beneficiaries/stats');
  return response?.data;
};

export const useGetBeneficiaryStats = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_BENEFICIARIES_STATS],
    queryFn: () => listBeneficiaryStatus(),
  });
};

const updateBeneficiary = async (payload: any) => {
  const response = await api.patch(`/beneficiaries/${payload.uuid}`, payload);
  return response?.data;
};

export const useUpdateBeneficiary = () => {
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

export const useAddBulkBeneficiary = () => {
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

export const useUploadBeneficiary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: any) => uploadBeneficiary(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
    },
  });
};

export const useBeneficiaryPii = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_BENEFICIARIES],
    queryFn: () => {
      return api
        .get('/beneficiaries/pii')
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.error('Error:', error);
          throw error;
        });
    },
  });
};
