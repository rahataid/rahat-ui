import { CreateProjectPayload } from '@rahat-ui/types';
import { useRSQuery } from '@rumsan/react-query';
import {
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAGS } from '../../config';

import { Beneficiary, MS_ACTIONS } from '@rahataid/sdk';
import { getProjectClient } from '@rahataid/sdk/clients';
import { Project, ProjectActions } from '@rahataid/sdk/project/project.types';
import { Pagination } from '@rumsan/sdk/types';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useSwal } from '../../swal';
import { api } from '../../utils/api';
import { useProjectSettingsStore, useProjectStore } from './project.store';

const createProject = async (payload: CreateProjectPayload) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

export const useProjectCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export const useProjectAction = <T = any>() => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  return useMutation<
    FormattedResponse<T>,
    Error,
    {
      uuid: `${string}-${string}-${string}-${string}-${string}`;
      data: ProjectActions;
    },
    unknown
  >(
    {
      mutationFn: projectClient.projectActions,
    },
    queryClient,
  );
};

export const useAssignBenToProject = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      beneficiaryUUID,
      projectUUID,
    }: {
      projectUUID: UUID;
      beneficiaryUUID: UUID;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'beneficiary.assign_to_project',
          payload: {
            beneficiaryId: beneficiaryUUID,
          },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Beneficiary Assigned Successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating Beneficiary',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useBulkAssignBenToProject = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      beneficiaryUUIDs,
      projectUUID,
    }: {
      projectUUID: UUID;
      beneficiaryUUIDs: any[];
    }) => {
      const assign = beneficiaryUUIDs.map((beneficiaryUUID) => {
        return q.mutateAsync({
          uuid: projectUUID,
          data: {
            action: 'beneficiary.assign_to_project',
            payload: {
              beneficiaryId: beneficiaryUUID,
            },
          },
        });
      });
      return Promise.all(assign);
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Beneficiary Assigned Successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating Beneficiary',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAssignVendorToProject = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      vendorUUID,
      projectUUID,
    }: {
      projectUUID: UUID;
      vendorUUID: UUID;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'vendor.assign_to_project',
          payload: {
            vendorId: vendorUUID,
          },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Vendor Assigned Successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating Vendor',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useProjectSettings = (uuid: UUID) => {
  const q = useProjectAction();
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [TAGS.GET_PROJECT_SETTINGS, uuid],
    enabled: isEmpty(settings?.[uuid]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: 'CONTRACT',
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (query.isSuccess) {
      setSettings({
        ...settings,
        [uuid]: query?.data,
      });
    }
  }, [query.data]);

  return query;
};

export const useProjectList = (
  payload: Pagination,
): UseQueryResult<FormattedResponse<Project[]>, Error> => {
  const { queryClient, rumsanService } = useRSQuery();

  const projectClient = getProjectClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_ALL_PROJECTS, payload],
      // todo, add support for pagination
      queryFn: () => projectClient.list(payload as any),
      refetchOnWindowFocus: true,
      retryOnMount: true,
    },
    queryClient,
  );
};
export const useProject = (
  uuid: UUID,
): UseQueryResult<FormattedResponse<Project>, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const setSingleProject = useProjectStore((state) => state.setSingleProject);

  const projectClient = getProjectClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_PROJECT_DETAILS, uuid],
      queryFn: () => projectClient.get(uuid),
    },
    queryClient,
  );

  useEffect(() => {
    if (query.data) {
      setSingleProject(query.data.data); // Access the 'data' property of the 'FormattedResponse' object
    }
  }, [query.data]);
  return query;
};

type GetProjectBeneficiaries = Pagination & {
  order?: 'asc' | 'desc';
  sort?: string;
  status?: string;
  projectUUID: UUID;
};

export const useProjectBeneficiaries = (payload: GetProjectBeneficiaries) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const queryKey = useMemo(
    () => [MS_ACTIONS.BENEFICIARY.LIST_BY_PROJECT, restPayloadString],
    [restPayloadString],
  );

  const query = useQuery({
    queryKey: [MS_ACTIONS.BENEFICIARY.LIST_BY_PROJECT, restPayloadString],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.BENEFICIARY.LIST_BY_PROJECT,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return {
    ...query,
    data: useMemo(() => {
      return {
        ...query.data,
        data: query.data?.data?.length
          ? query.data.data.map((row: any) => ({
              uuid: row?.Beneficiary?.uuid,
              wallet: row?.Beneficiary?.walletAddress,
              name: row?.piiData?.name,
              gender: row?.Beneficiary?.gender,
              phone: row?.piiData?.phone || 'N/A',
              type: row?.Beneficiary?.type || 'N/A',
              phoneStatus: row?.Beneficiary?.phoneStatus,
              bankedStatus: row?.Beneficiary?.bankedStatus,
              internetStatus: row?.Beneficiary?.internetStatus,
            }))
          : [],
      };
    }, [query.data]),
  };
};
