import { MS_ACTIONS } from '@rahataid/sdk';
import { Pagination } from '@rumsan/sdk/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'elProject.campaign.create';
const UPDATE_CAMPAIGN = 'elProject.campaign.update';
const CREATE_AUDIENCE = 'elProject.campaign.create_audience';
const CREATE_BULK_AUDIENCE = 'elProject.campaign.create_bulk_audience';
const GET_ALL_CAMPAIGN = 'elProject.campaign.get';
const GET_CAMPAIGN = 'elProject.campaign.getOne';
const GET_ALL_TRANSPORT = 'elProject.campaign.get_transport';
const GET_ALL_AUDIENCE = 'elProject.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'elProject.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'elProject.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'elProject.campaign.communication_stats';
const GET_CAMPAIGN_LOGS = 'elProject.campaign.log';
const CREATE_TEMPLATE = 'elProject.campaign.create_template';
const GET_TEMPLATE = 'elProject.campaign.list_templates';

const queryKeys = {
  //elCrmQueryKeys
  elCrmCampaignList: 'elCrmCampaignList',
  elCrmCampaignLogs: 'elCrmCampaignLogs',
  elCrmCampaign: 'elCrmCampaign',
  elCrmListTransport: 'elCrmListTransport',
  elCrmCreateTemplate: 'elCrmCreateTemplate',
  elCrmListTemplate: 'elCrmListTemplate',
};

// Hooks for create campaign
export const useCreateElCrmCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_CAMPAIGN,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Campaign added successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmCampaignList],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Error while creating campaign.',
        icon: 'error',
      });
    },
  });
};

export const useUpdateCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: UPDATE_CAMPAIGN,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Campaign updated successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmCampaignList],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Error while updating campaign.',
        icon: 'error',
      });
    },
  });
};

export const useTriggerElCrmCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: TRIGGER_CAMPAIGN,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Campaign trigger successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmCampaignLogs],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmCampaign],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Failed to trigger campaign.',
        icon: 'error',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmCampaignLogs],
      });
    },
  });
};

export const useListElCrmCampaign = (
  projectUUID: UUID,
  payload: Pagination & { [key: string]: string },
) => {
  const action = useProjectAction();

  const query = useQuery({
    queryKey: [queryKeys.elCrmCampaignList, projectUUID, payload],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_CAMPAIGN,
          payload: payload,
        },
      });
      return { data: res.data, meta: res.response.meta };
    },
  });
  return {
    ...query,
    data: query?.data?.data || [],
    meta: query?.data?.meta,
  };
};

export const useListRpCommunicationStats = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaignStats'],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_COMMUNICATION_STATS,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useListRpCommunicationLogs = (
  projectUUID: UUID,
  payload: Pagination,
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCommunicationLogs', projectUUID, payload],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_COMMUNICATION_LOGS,
          payload: payload,
        },
      });
      return res;
    },
  });
};

export const useListElCrmCampaignLog = (projectUUID: UUID, payload: any) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmCampaignLogs, projectUUID, payload],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_CAMPAIGN_LOGS,
          payload: payload,
        },
      });
      return res;
    },
  });
};

export const useGetElCrmCampaign = (projectUUID: UUID, uuid: string) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmCampaign, projectUUID, uuid],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_CAMPAIGN,
          payload: { uuid },
        },
      });
      return res.data;
    },
  });
};

export const useListElCrmTransport = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmListTransport, projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_TRANSPORT,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useCreateTemplate = (projectUUID: UUID) => {
  const action = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_TEMPLATE,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Template Created successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmListTemplate],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Error while creating template.',
        icon: 'error',
      });
    },
  });
};

export const useListElCrmTemplate = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmListTemplate, projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_TEMPLATE,
          payload: {},
        },
      });
      return res.data;
    },
  });
};
