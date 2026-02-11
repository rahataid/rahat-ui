'use client';
import { getBeneficiaryClient } from '@rahataid/sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import {
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { TAGS } from '../../config';
import { useSwal } from '../../swal';
import { api } from '../../utils/api';
import { useBeneficiaryGroupsStore } from './beneficiary-groups.store';
import { useBeneficiaryStore } from './beneficiary.store';

const GET_BENEFICIARY_GROUP = 'GET_BENEFICIARY_GROUP';
const GET_FAILED_BANK_ACCOUNT_BENEFICIARY =
  'GET_FAILED_BANK_ACCOUNT_BENEFICIARY';
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
    params: payload,
  });
  return response?.data;
};

const removeBeneficiaryGroup = async (uuid: UUID) => {
  const response = await api.delete(
    `/beneficiaries/groups/${uuid}?hardDelete=true`,
  );
  return response?.data;
};

const getBeneficiaryGroup = async (uuid: UUID) => {
  const response = await api.get(`/beneficiaries/groups/${uuid}`);
  return response?.data;
};

const getBeneficiaryFailedBankAccount = async (uuid: UUID) => {
  const response = await api.get(
    `/beneficiaries/groups/${uuid}/fail-account/export`,
  );
  return response?.data;
};

const validateBeneficiaryBankAccount = async (uuid: UUID) => {
  const response = await api.get(`/beneficiaries/groups/${uuid}/account-check`);
};

const updateGroupPropose = async (uuid: UUID, groupPurpose: string) => {
  const response = await api.patch(
    `/beneficiaries/groups/${uuid}/addGroupPurpose`,
    {
      groupPurpose,
    },
  );
};
export const useBeneficiaryGroupsList = (payload: any): any => {
  const { queryClient } = useRSQuery();

  const { setBeneficiaryGroups, setMeta } = useBeneficiaryGroupsStore(
    (state) => ({
      setBeneficiaryGroups: state.setBeneficiaryGroups,
      setMeta: state.setMeta,
    }),
  );

  const benGroups = useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARIES_GROUPS, payload],
      queryFn: () => listBeneficiaryGroups(payload),
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
    queryClient,
  );

  useEffect(() => {
    if (benGroups.data) {
      setBeneficiaryGroups(benGroups?.data?.data as any[]);
      setMeta(benGroups?.data?.meta);
    }
  }, [benGroups.data, setBeneficiaryGroups]);

  const mappedGroupData = benGroups?.data?.data?.map((d: any) => ({
    ...d,
    totalMembers: d?._count?.groupedBeneficiaries,
  }));

  return {
    ...benGroups,
    data: mappedGroupData,
    meta: benGroups?.data?.meta,
  };
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

const updateBeneficiaryGroup = async (payload: any) => {
  const response = await api.patch(
    `/beneficiaries/groups/${payload.uuid}`,
    payload,
  );
  return response?.data;
};

export const useUpdateBeneficiaryGroup = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (payload: any) => updateBeneficiaryGroup(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES_GROUPS] });
      toast.fire({
        title: 'Beneficiary Group updated successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while updating beneficiary group.',
        icon: 'error',
        text: errorMessage,
      });
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
      staleTime: 10 * 60 * 1000, // 10 minutes
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

export const useRemoveBeneficiaryFromProject = () => {
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

export const useValidateBeneficaryBankAccount = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (payload: any) => validateBeneficiaryBankAccount(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.VALIDATE_BENEFICIARIES] });
      toast.fire({
        title: 'Accounts check in progress. Data will be listed soon',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while validating beneficiary.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateGroupPropose = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (payload: any) =>
      updateGroupPropose(payload.uuid, payload.selectedPurpose),
    onSuccess: async (_data, variables) => {
      if (variables?.uuid) {
        await qc.invalidateQueries({
          queryKey: ['GET_BENEFICIARY_GROUP', variables.uuid],
          exact: false,
        });
      }
      toast.fire({
        title: 'Group propose updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while updating group propose',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
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

export const useRemoveBeneficiaryGroup = () => {
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: (uuid: UUID) => removeBeneficiaryGroup(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES_GROUPS] });
      toast.fire({
        title: 'Beneficiary group removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      toast.fire({
        title: 'Error while removing beneficiary group.',
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
  projectId?: UUID,
) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('doctype', doctype);
  if (projectId) formData.append('projectId', projectId);
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
        projectId,
      }: {
        selectedFile: File;
        doctype: string;
        projectId?: UUID;
      }) =>
        uploadBeneficiary(
          selectedFile,
          doctype,
          rumsanService.client,
          projectId,
        ),
      onSuccess: (data) => {
        if (data?.data?.success === false) {
          toast.fire({
            icon: 'error',
            title: 'Something went wrong',
            text: data?.data?.message || '',
          });
          return;
        }
        if (data?.data?.discardedBeneficiaries?.length > 0) {
          const phoneNumber = data?.data?.discardedBeneficiaries?.map(
            (d: any) => {
              return d?.phoneNumber;
            },
          );
          toast.fire({
            icon: 'success',
            title: `Some beneficiaries were discarded due to error in Xcapit Wallet Creation.${phoneNumber}`,
            timer: 5000,
          });
          return;
        }
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

const uploadBeneficiaryBulkQueue = async (
  selectedFile: File,
  doctype: string,
  client: any,
  projectId?: UUID,
  automatedGroupOption?: {
    createAutomatedGroup?: boolean;
    groupKey?: string;
  },
) => {
  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('doctype', doctype);
  if (projectId) formData.append('projectId', projectId);
  formData.append(
    'automatedGroupOption[createAutomatedGroup]',
    Boolean(automatedGroupOption?.createAutomatedGroup).toString(),
  );
  if (automatedGroupOption?.createAutomatedGroup) {
    formData.append(
      'automatedGroupOption[groupKey]',
      automatedGroupOption.groupKey as string,
    );
  }
  const response = await client.post('/beneficiaries/upload-queue', formData);
  return response?.data;
};
export const useUploadBeneficiaryBulkQueue = () => {
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
        projectId,
        automatedGroupOption,
      }: {
        selectedFile: File;
        doctype: string;
        projectId?: UUID;
        automatedGroupOption: {
          createAutomatedGroup: boolean;
          groupKey: string;
        };
      }) =>
        uploadBeneficiaryBulkQueue(
          selectedFile,
          doctype,
          rumsanService.client,
          projectId,
          automatedGroupOption,
        ),
      onSuccess: (data) => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARIES] });
        toast.fire({
          icon: 'success',
          title: data?.data?.message,
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
  payload: {
    projectId: UUID;
  } & Partial<Pagination>,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARIES, payload],
      queryFn: () => benClient.listPiiData(payload),
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

export const useListTempGroups = (
  payload: Pagination & { [key: string]: string },
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_TEMP_GROUPS, payload],
      // @ts-ignore
      queryFn: () => benClient.listTempGroups(payload),
    },
    queryClient,
  );
};

export const useListTempBeneficiary = (
  uuid: string,
  data?: Pagination & { [key: string]: string },
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_TEMP_BENEFICIARIES, uuid, data],
      queryFn: () => benClient.listTempBeneficiary(uuid, data),
    },
    queryClient,
  );
};

export const useTempBeneficiaryImport = () => {
  const { rumsanService, queryClient } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useMutation({
    mutationKey: [TAGS.IMPORT_TEMP_BENEFICIARIES],
    mutationFn: async (payload: any) => {
      // const { isConfirmed } = await Swal.fire({
      //   title: 'CAUTION!',
      //   text: ' Are you sure , you want to import beneficiary?',
      //   icon: 'warning',
      //   confirmButtonText: 'Yes, I am sure!',
      //   showCancelButton: true,
      // });

      // if (!isConfirmed) return;

      return await benClient.importTempBeneficiaries(payload);
    },
    onSuccess: (d) => {
      if (!d) return;
      Swal.fire('Beneficiaries will be imported shortly!', '', 'success');
      queryClient.invalidateQueries({
        queryKey: [
          TAGS.GET_TEMP_BENEFICIARIES,
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
  });
};
export const useGetBeneficiaryGroup = (
  uuid: UUID,
): UseQueryResult<any, Error> => {
  const { rumsanService, queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: [GET_BENEFICIARY_GROUP, uuid],
      // @ts-ignore
      queryFn: () => getBeneficiaryGroup(uuid),
      refetchOnWindowFocus: true,
    },
    queryClient,
  );
};

export const useExportBeneficiariesFailedBankAccount = (
  uuid: UUID,
): UseQueryResult<any, Error> => {
  const { queryClient } = useRSQuery();
  return useQuery(
    {
      queryKey: [GET_FAILED_BANK_ACCOUNT_BENEFICIARY, uuid],
      queryFn: () => getBeneficiaryFailedBankAccount(uuid),
      enabled: !!uuid,
    },
    queryClient,
  );
};
