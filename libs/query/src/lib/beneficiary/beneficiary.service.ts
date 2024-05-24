import {
  UseQueryResult,
  keepPreviousData,
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
import { UUID } from 'crypto';
import { useSwal } from '../../swal';
import { Pagination } from '@rumsan/sdk/types';
import { useBeneficiariesGroupStore } from '../aa';
import { useBeneficiaryGroupsStore } from './beneficiary-groups.store';

const createNewBeneficiary = async (payload: any) => {
  const response = await api.post('/beneficiaries', payload);
  return response?.data;
};

const createNewBeneficiaryGroup = async (payload: any) => {
  const response = await api.post('/beneficiaries/groups', payload);
  return response?.data;
};

const listBeneficiaryGroups = async (payload: Pagination) => {
  const response = await api.get('/beneficiaries/groups/all', {
    params: payload
  });
  return response?.data;
};


export const useBeneficiaryGroupsList = (payload: any): any => {
  const { queryClient } = useRSQuery();

  const { setBeneficiaryGroups, setMeta } = useBeneficiaryGroupsStore((state) => ({
    setBeneficiaryGroups: state.setBeneficiaryGroups,
    setMeta: state.setMeta,
  }));

  const benGroups = useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARIES_GROUPS, payload],
      queryFn: () => listBeneficiaryGroups(payload),
      placeholderData: keepPreviousData,
    },
    queryClient,
  );

  useEffect(() => {
    if (benGroups.data) {
      console.log("ben groups", benGroups);
      setBeneficiaryGroups(benGroups?.data?.data as any[]);
      setMeta(benGroups?.data?.meta);
    }
  }, [benGroups.data, setBeneficiaryGroups]);

  const mappedGroupData = benGroups?.data?.data?.map((d: any) => ({
    ...d,
    totalMembers: d?._count?.groupedBeneficiaries
  }))

  return {
    ...benGroups,
    data: mappedGroupData,
    meta: benGroups?.data?.meta
  }
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

export const useCreateBeneficiaryGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createNewBeneficiaryGroup(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES_GROUPS] });
    },
  });
};


// Todo: Change type of return
export const useBeneficiaryList = (payload: any): any => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  const { setBeneficiaries, setMeta } = useBeneficiaryStore((state) => ({
    setBeneficiaries: state.setBeneficiaries,
    setMeta: state.setMeta,
  }));

  const ben = useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARIES, payload],
      queryFn: () => benClient.list(payload),
      placeholderData: keepPreviousData,
    },
    queryClient,
  );

  useEffect(() => {
    if (ben.data) {
      setBeneficiaries(ben.data.data as any[]);
      setMeta(ben.data.response.meta);
    }
  }, [ben.data, setBeneficiaries]);

  const filteredBenData = {
    ...ben,
    data: {
      ...ben?.data,
      data: ben?.data?.data.map((row) => {
        return {
          ...row,
          name: row?.piiData?.name || '',
        };
      }),
    },
  };

  return filteredBenData;
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

const listProjectBeneficiaryStats = async (id: any) => {
  const response = await api.get(`/projects/${id}/stats`);
  return response?.data;
};

export const useGetProjectBeneficiaryStats = (id: any) => {
  return useQuery({
    queryKey: [TAGS.GET_PROJECT_BENEFICIARIES_STATS],
    queryFn: () => listProjectBeneficiaryStats(id),
  });
};

const updateBeneficiary = async (payload: any) => {
  const response = await api.patch(`/beneficiaries/${payload.uuid}`, payload);
  return response?.data;
};

export const useUpdateBeneficiary = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (payload: any) => updateBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
      toast.fire({
        title: 'Beneficiary updated successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while updating beneficiary.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

const removeBeneficiary = async (payload: any) => {
  await api.patch(`/beneficiaries/remove/${payload.uuid}`, payload);
};

export const useRemoveBeneficiary = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (payload: any) => removeBeneficiary(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
      toast.fire({
        title: 'Beneficiary removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while removing beneficiary.',
        icon: 'error',
        text: errorMessage,
      });
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

const uploadBeneficiary = async (
  selectedFile: File,
  doctype: string,
  client: any,
) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('doctype', doctype);

  const response = await client.post('/beneficiaries/upload', formData);
  return response?.data;
};

export const useUploadBeneficiary = () => {
  const qc = useQueryClient();
  const { rumsanService, queryClient } = useRSQuery();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation(
    {
      mutationFn: ({
        selectedFile,
        doctype,
      }: {
        selectedFile: File;
        doctype: string;
      }) => uploadBeneficiary(selectedFile, doctype, rumsanService.client),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
        toast.fire({
          icon: 'success',
          title: 'Beneficiary uploaded successfully',
        });
      },
      onError: (error: any) => {
        console.log('error', error);
        const message = error.response?.data?.message || error.message;
        toast.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: message,
        });
      },
    },
    queryClient,
  );
};
type OptionalPagination = Partial<Pagination>;

export const useBeneficiaryPii = (
  // TODO: UPDATE WITH OPTIONALPAGINATION
  pagination: Pagination,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARIES, pagination],
      queryFn: () => benClient.listPiiData(pagination as Pagination),
    },
    queryClient,
  );
};

export const useSingleBeneficiary = (
  uuid: UUID,
): UseQueryResult<any, Error> => {
  const { setSingleBeneficiary } = useBeneficiaryStore();
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARY, uuid],
      queryFn: () => benClient.get(uuid),
    },
    queryClient,
  );

  useEffect(() => {
    if (query.data) {
      setSingleBeneficiary(query.data.data);
    }
  }, [query.data, setSingleBeneficiary]);

  return query;
};
