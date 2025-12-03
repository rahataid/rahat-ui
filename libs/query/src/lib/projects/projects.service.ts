'use client';
import { CreateProjectPayload } from '@rahat-ui/types';
import { Beneficiary, MS_ACTIONS } from '@rahataid/sdk';
import { getProjectClient } from '@rahataid/sdk/clients';
import { Project, ProjectActions } from '@rahataid/sdk/project/project.types';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { FormattedResponse } from '@rumsan/sdk/utils';
import {
  UseQueryResult,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { UUID } from 'crypto';
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { MS_CAM_ACTIONS, PROJECT_SETTINGS_KEYS, TAGS } from '../../config';
import { useSwal } from '../../swal';
import { api } from '../../utils/api';
import { useProjectSettingsStore, useProjectStore } from './project.store';
import Swal from 'sweetalert2';

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

export const useProjectAction = <T = any>(key?: string[]) => {
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
      mutationKey: key || ['projectAction'],
      mutationFn: projectClient.projectActions,
    },
    queryClient,
  );
};
export const useGeneralAction = <T = any>() => {
  const { queryClient, rumsanService } = useRSQuery();
  const projectClient = getProjectClient(rumsanService.client);
  return useMutation<
    FormattedResponse<T>,
    Error,
    {
      data: ProjectActions;
    },
    unknown
  >(
    {
      mutationKey: ['generalAction'],
      mutationFn: projectClient.generalActions,
    },
    queryClient,
  );
};

export const useAssignBenToProject = () => {
  const q = useProjectAction();
  const { queryClient, rumsanService } = useRSQuery();

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
      console.log(
        'assigning beneficiary to project',
        beneficiaryUUID,
        projectUUID,
      );
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
      queryClient.invalidateQueries({ queryKey: [TAGS.GET_BENEFICIARY] });
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

export const useAssignBenGroupToProject = () => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      beneficiaryGroupUUID,
      projectUUID,
    }: {
      projectUUID: UUID;
      beneficiaryGroupUUID: UUID;
    }) => {
      const response = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'beneficiary.assign_group_to_project',
          payload: {
            beneficiaryGroupId: beneficiaryGroupUUID,
          },
        },
      });
      return response?.data;
    },
    onSuccess: async (_data, variables) => {
      q.reset();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['GET_BENEFICIARY_GROUP', variables.beneficiaryGroupUUID],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: [TAGS.GET_BENEFICIARIES_GROUPS],
          exact: false,
        }),
      ]);

      toast.fire({
        title: 'Beneficiary group assigned Successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while assigning beneficiary group',
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

export const useProjectContractSettings = (uuid: UUID) => {
  const q = useProjectAction(['PROJECT_SETTINGS_KEYS.CONTRACT']);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [TAGS.GET_PROJECT_SETTINGS, uuid, PROJECT_SETTINGS_KEYS.CONTRACT],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.CONTRACT,
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (query.isSuccess) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.CONTRACT]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      // setSettings({
      //   [uuid]: {
      //     [PROJECT_SETTINGS_KEYS.CONTRACT]: query?.data,
      //   },
      // });
    }
  }, [query.data]);

  return query;
};

export const useProjectSafeWalletSettings = (uuid: UUID) => {
  const q = useProjectAction(['PROJECT_SETTINGS_KEYS.SAFE_WALLET']);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [
      TAGS.GET_PROJECT_SETTINGS,
      uuid,
      PROJECT_SETTINGS_KEYS.SAFE_WALLET,
    ],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SAFE_WALLET]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.SAFE_WALLET,
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (query.isSuccess) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.SAFE_WALLET]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      // setSettings({
      //   [uuid]: {
      //     [PROJECT_SETTINGS_KEYS.CONTRACT]: query?.data,
      //   },
      // });
    }
  }, [query.data]);

  return query;
};

export const useProjectSubgraphSettings = (uuid: UUID) => {
  const q = useProjectAction(['PROJECT_SETTINGS_KEYS.SUBGRAPH']);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [TAGS.GET_PROJECT_SETTINGS, uuid, PROJECT_SETTINGS_KEYS.SUBGRAPH],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.SUBGRAPH,
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.SUBGRAPH]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      window.location.reload();
      // setSettings({
      //   [uuid]: {
      //     [PROJECT_SETTINGS_KEYS.SUBGRAPH]: query?.data,
      //   },
      // });
    }
  }, [query.data]);

  return query;
};

export const useProjectBlockChainSettings = (uuid: UUID) => {
  const q = useProjectAction(['PROJECT_SETTINGS_KEYS.BLOCKCHAIN']);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [
      TAGS.GET_PROJECT_SETTINGS,
      uuid,
      PROJECT_SETTINGS_KEYS.BLOCKCHAIN,
    ],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.BLOCKCHAIN]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.BLOCKCHAIN,
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.BLOCKCHAIN]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      window.location.reload();
      // setSettings({
      //   [uuid]: {
      //     [PROJECT_SETTINGS_KEYS.SUBGRAPH]: query?.data,
      //   },
      // });
    }
  }, [query.data]);

  return query;
};

export const useAAProjectSettingsDatasource = (uuid: UUID) => {
  const q = useProjectAction([PROJECT_SETTINGS_KEYS.DATASOURCE]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [
      TAGS.GET_PROJECT_SETTINGS,
      uuid,
      PROJECT_SETTINGS_KEYS.DATASOURCE,
    ],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.DATASOURCE]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.DATASOURCE,
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      console.log('query data', query.data);
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.DATASOURCE]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      window.location.reload();
      // setSettings({
      //   [uuid]: {
      //     [PROJECT_SETTINGS_KEYS.SUBGRAPH]: query?.data,
      //   },
      // });
    }
  }, [query.data]);

  return query;
};

export const useAAProjectSettingsHazardType = (uuid: UUID) => {
  const q = useProjectAction([PROJECT_SETTINGS_KEYS.HAZARD_TYPE]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [
      TAGS.GET_PROJECT_SETTINGS,
      uuid,
      PROJECT_SETTINGS_KEYS.HAZARD_TYPE,
    ],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.HAZARD_TYPE]),
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.HAZARD_TYPE,
          },
        },
      });
      return mutate.data.value;
    },
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.HAZARD_TYPE]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      window.location.reload();
    }
  }, [query.data]);

  return query;
};

export const useAAProjectSettingsContract = (uuid: UUID) => {
  const q = useProjectAction([PROJECT_SETTINGS_KEYS.CONTRACT]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [TAGS.GET_PROJECT_SETTINGS, uuid, PROJECT_SETTINGS_KEYS.CONTRACT],
    enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT]),
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.CONTRACT,
          },
        },
      });
      return mutate.data.value;
    },
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      console.log('query data', query.data);
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.CONTRACT]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
      window.location.reload();
    }
  }, [query.data]);

  return query;
};

export const useProjectList = (
  payload?: Pagination,
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
  type?: string;
  vouchers?: any;
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
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
              ...row,
              uuid: row?.uuid?.toString(),
              walletAddress: row?.walletAddress?.toString(),
              voucherClaimStatus: row?.claimStatus,
              name: row?.piiData?.name || '',
              email: row?.piiData?.email || '',
              gender: row?.projectData?.gender?.toString() || '',
              phone: row?.piiData?.phone || 'N/A',
              type: row?.type?.toString() || 'N/A',
              phoneStatus: row?.projectData?.phoneStatus || '',
              bankedStatus: row?.projectData?.bankedStatus || '',
              internetStatus: row?.projectData?.internetStatus || '',
              benTokens: row?.benTokens || 'N/A',
            }))
          : [],
      };
    }, [query.data]),
  };
};

export const useProjectBeneficiaryDetail = (payload: any) => {
  const q = useProjectAction<Beneficiary>();
  const { projectUUID, ...restPayload } = payload;

  const query = useQuery({
    queryKey: ['beneficiary.get_one_beneficiary', restPayload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'beneficiary.get_one_beneficiary',
          payload: restPayload,
        },
      });
      return mutate?.data;
    },
  });
  return query;
};

export const useBeneficiaryRedeemInfo = (payload: any) => {
  const q = useProjectAction();
  const { projectUUID, beneficiaryUUID } = payload;

  const query = useQuery({
    queryKey: [
      'aaProject.beneficiary.getRedeemInfo',
      { projectUUID, beneficiaryUUID },
    ],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.beneficiary.getRedeemInfo',
          payload: {
            beneficiaryUUID,
          },
        },
      });
      return mutate?.data;
    },
  });
  return query;
};

export const useListELRedemption = (
  payload: Pagination & { uuid: UUID },
): any => {
  const projectAction = useProjectAction(['redemptionList']);
  const query = useQuery({
    queryKey: ['elProject.listRedemption'],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const d = await projectAction.mutateAsync({
        uuid: payload.uuid,
        data: {
          action: 'elProject.listRedemption',
          payload: {
            page: payload.page,
            perPage: payload.perPage,
          },
        },
      });
      return d;
    },
  });

  return query;
};

export const useUpdateElRedemption = () => {
  const projectAction = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    onSuccess: () => {
      toast.fire({
        title: 'Redemption Successful.',
        icon: 'success',
      });
    },
    mutationFn: async ({
      projectUUID,
      redemptionUUID,
    }: {
      projectUUID: UUID;
      redemptionUUID: string[];
    }) => {
      const m = await projectAction.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_ACTIONS.ELPROJECT.UPDATE_REDEMPTION,
          payload: {
            uuid: redemptionUUID,
          },
        },
      });
      return m;
    },
  });
};

export const useProjectEdit = () => {
  const { queryClient, rumsanService } = useRSQuery();
  // const projectClient = getProjectClient(rumsanService.client);
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation(
    {
      onSuccess: () => {
        toast.fire({
          title: 'Project edited successfully',
          icon: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: [TAGS.GET_PROJECT_DETAILS],
        });
      },
      onError: () => {
        toast.fire({
          title: 'Error while editing project.',
          icon: 'error',
        });
      },
      mutationKey: ['projectEdit'],
      mutationFn: async ({ uuid, data }: { uuid: UUID; data: any }) => {
        const res = await rumsanService.client.patch(`/projects/${uuid}`, data);
        return res;
      },
    },
    queryClient,
  );
};

export const useCHWList = (payload: any) => {
  const action = useProjectAction();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.CHW.LIST, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.CHW.LIST,
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
      };
    }, [query.data]),
  };
};
// cambodia.chw.get

export const useCHWGet = (payload: any) => {
  const action = useProjectAction();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.CHW.GET, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.CHW.GET,
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
      };
    }, [query.data]),
  };
};

export const useCambodiaBeneficiaries = (payload: any) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.BENEFICIARY.LIST, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.BENEFICIARY.LIST,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return { ...query };
};

export const useCambodiaBeneficiary = (payload: any) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.BENEFICIARY.GET, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.BENEFICIARY.GET,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return {
    ...query,
  };
};

export const useCambodiaVendorsList = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.VENDOR.LIST_BY_PROJECT,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.VENDOR.LIST_BY_PROJECT,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaVendorGet = (payload: any) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.VENDOR.GET_BY_UUID, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.VENDOR.GET_BY_UUID,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return {
    ...query,
  };
};

export const useCambodiaCommisionList = (payload: any) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.LIST,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.LIST,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return {
    ...query,
  };
};

export const useCambodiaCommisionCurrent = (payload: any) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.GET_CURRENT,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.GET_CURRENT,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return {
    ...query,
  };
};

export const useCambodiaCommisionCreate = () => {
  const q = useProjectAction<any[]>();
  const qc = useQueryClient();

  return useMutation({
    mutationKey: [MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.CREATE],

    mutationFn: async (payload: any) => {
      const { projectUUID, ...restPayload } = payload;

      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.CREATE,
          payload: restPayload,
        },
      });
      return mutate;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.GET_CURRENT],
      });
    },
  });
};

export const useCambodiaDiscardedBeneficiaries = (payload: any) => {
  const q = useProjectAction<Beneficiary[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.BENEFICIARY.DISCARDED_LIST,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.BENEFICIARY.DISCARDED_LIST,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return { ...query };
};

export const useCambodiaVendorsStats = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.VENDOR.STATS, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.VENDOR.STATS,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useCambodiaHealthWorkerByUUIDStats = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.CHW.STATS, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.CHW.STATS,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useCambodiaVendorHealthWorkers = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.VENDOR.HEALTH_WORKERS,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.VENDOR.HEALTH_WORKERS,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useCambodiaVendorLeadConversions = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.VENDOR.LEAD_CONVERSIONS,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.VENDOR.LEAD_CONVERSIONS,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaHealthWorkersStats = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.CHW.BENEFICIARIES_STATS,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.CHW.BENEFICIARIES_STATS,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaCommsList = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.LIST, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.LIST,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaBroadCastCounts = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.BROAD_CAST_STATUS_COUNT,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.BROAD_CAST_STATUS_COUNT,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaLineChartsReports = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.LINE_STATS, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.LINE_STATS,
          payload: restPayload?.filters,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaCommisionStats = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [
      MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.STATS,
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMISION_SCHEME.STATS,
          payload: restPayload,
        },
      });

      return mutate?.data
        ?.filter((item) =>
          ['TOTAL_LEAD_CONVERTED', 'TOTAL_COMMISSION_EARNED'].includes(
            item.name,
          ),
        )
        ?.sort((a, b) => {
          if (a.name === 'TOTAL_LEAD_CONVERTED') return -1;
          if (b.name === 'TOTAL_LEAD_CONVERTED') return 1;
          return 0;
        });
    },
  });
  return query;
};

export const useCambodiaProjectSettings = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [MS_CAM_ACTIONS.CAMBODIA.PROJECT_SETTINGS, restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.PROJECT_SETTINGS,
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useCambodiaTriggerComms = () => {
  const q = useProjectAction<any[]>();
  const qc = useQueryClient();

  return useMutation({
    mutationKey: [MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.TRIGGER_COMMUNICATION],

    mutationFn: async (payload: any) => {
      const { projectUUID, ...restPayload } = payload;

      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.TRIGGER_COMMUNICATION,
          payload: restPayload,
        },
      });
      return mutate;
    },
    onSuccess: () => {
      Swal.fire(
        'Your message is scheduled and will be delivered shortly',
        '',
        'success',
      );
      qc.invalidateQueries({
        queryKey: [MS_CAM_ACTIONS.CAMBODIA.COMMUNICATION.LIST],
      });
    },
  });
};
export const useValidateHealthWorker = () => {
  const q = useProjectAction<any[]>();
  const qc = useQueryClient();

  return useMutation({
    mutationKey: [MS_CAM_ACTIONS.CAMBODIA.CHW.VALIDATE_HEALTH_WORKER],

    mutationFn: async (payload: any) => {
      const { projectUUID, ...restPayload } = payload;

      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: MS_CAM_ACTIONS.CAMBODIA.CHW.VALIDATE_HEALTH_WORKER,
          payload: restPayload,
        },
      });
      return mutate;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: [MS_CAM_ACTIONS.CAMBODIA.CHW.VALIDATE_HEALTH_WORKER],
      });
    },
  });
};

export const useProjectInfo = (uuid: UUID) => {
  const q = useProjectAction([PROJECT_SETTINGS_KEYS.PROJECT_INFO]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: ['settings.get.project.info', uuid],
    staleTime: Infinity,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.PROJECT_INFO,
          },
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.PROJECT_INFO]: query?.data.value,
        },
      };
      setSettings(settingsToUpdate);
    }
  }, [query.data]);
  return query;
};

export const useStellarSettings = (uuid: UUID) => {
  const q = useProjectAction([PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: ['settings.get.stellar.settings', uuid],
    staleTime: Infinity,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS,
          },
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]: query?.data.value,
        },
      };
      setSettings(settingsToUpdate);
    }
  }, [query.data]);
  return query;
};

export const useOfframp = (uuid: UUID) => {
  const q = useProjectAction([PROJECT_SETTINGS_KEYS.OFFRAMP]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: ['settings.get.offramp', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.OFFRAMP,
          },
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.OFFRAMP]: query?.data.value,
        },
      };
      setSettings(settingsToUpdate);
    }
  }, [query.data]);
  return query;
};
export const useEntities = (uuid: UUID, name: string) => {
  const q = useProjectAction([name]);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const isChainEVM =
    settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS]?.type === 'evm';

  const query = useQuery({
    queryKey: ['settings.get.entities', uuid],
    enabled: isChainEVM,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name,
          },
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (!isEmpty(query.data)) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [name]: query?.data.value,
        },
      };
      setSettings(settingsToUpdate);
    }
  }, [query.data]);
  return query;
};

export const useProjectChainSettings = (uuid: UUID) => {
  const q = useProjectAction(['PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS']);
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [
      TAGS.GET_PROJECT_SETTINGS,
      uuid,
      PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS,
    ],
    staleTime: Infinity,
    // enabled: isEmpty(settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS]),
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS,
          },
        },
      });
      return mutate.data.value;
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      const settingsToUpdate = {
        ...settings,
        [uuid]: {
          ...settings?.[uuid],
          [PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS]: query?.data,
        },
      };
      setSettings(settingsToUpdate);
    }
  }, [query.data]);

  return query;
};
