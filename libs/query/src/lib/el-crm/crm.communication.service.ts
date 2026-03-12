import { MS_ACTIONS } from '@rahataid/sdk';
import { Pagination } from '@rumsan/sdk/types';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
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
const DELETE_TEMPLATE = 'elProject.campaign.delete_template';
const GET_TEMPLATE = 'elProject.campaign.list_templates';
const SYNC_TEMPLATE = 'elProject.campaign.sync_templates';
const BROADCAST_COUNT = 'elProject.campaign.broadcast_count';
const SESSION_BROADCAST = 'elProject.campaign.list_session_broadcasts';

const queryKeys = {
  //elCrmQueryKeys
  elCrmCampaignList: 'elCrmCampaignList',
  elCrmCampaignLogs: 'elCrmCampaignLogs',
  elCrmCampaign: 'elCrmCampaign',
  elCrmListTransport: 'elCrmListTransport',
  elCrmCreateTemplate: 'elCrmCreateTemplate',
  elCrmListTemplate: 'elCrmListTemplate',
  elCrmBroadcastCount: 'elCrmBroadcastCount',
  elCrmSessionBroadcast: 'elCrmSessionBroadcast',
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
    onError: (error) => {
      toast.fire({
        title: `Error while creating campaign. ${error?.message || ''}`,
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
  payload: Pagination & { [key: string]: string | boolean },
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
    queryKey: [queryKeys.elCrmListTransport],
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

export const useDeleteTemplate = (projectUUID: UUID) => {
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
    mutationFn: async (cuid: string) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: DELETE_TEMPLATE,
          payload: { cuid },
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Template Deleted successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmListTemplate],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Error while deleting template.',
        icon: 'error',
      });
    },
  });
};

export const useSyncTemplate = (projectUUID: UUID) => {
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
          action: SYNC_TEMPLATE,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Template Synced successfully',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.elCrmListTemplate],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Error while syncing template.',
        icon: 'error',
      });
    },
  });
};

export const useListElCrmTemplate = (projectUUID: UUID, payload?: any) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmListTemplate, projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_TEMPLATE,
          payload,
        },
      });
      return res.data;
    },
  });
};

export const useListElCrmSessionBroadcast = (
  projectUUID: UUID,
  payload: any,
  options?: UseQueryOptions,
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmSessionBroadcast, projectUUID, payload],
    enabled: options?.enabled,
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: SESSION_BROADCAST,
          payload,
        },
      });
      return res;
    },
  });
};

export const useListElCrmBroadCastCount = (
  projectUUID: UUID,
  payload: { sessionId: string },
  options?: UseQueryOptions,
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: [queryKeys.elCrmBroadcastCount, projectUUID, payload.sessionId],
    enabled: options?.enabled,
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: BROADCAST_COUNT,
          payload,
        },
      });
      return res.data;
    },
  });
};

export const useRetryFailedSession = (uuid: UUID) => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    // queryKey: ['retryfailed', uuid, communicationId],
    mutationFn: async (sessionId: string) => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'elProject.campaign.retry_session',
          payload: {
            sessionId,
          },
        },
      });
      return mutate.data;
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Success!',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'An error occured!';
      q.reset();
      toast.fire({
        title: 'Error while retrying.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};
