import { MS_ACTIONS } from '@rahataid/sdk';
import { Pagination } from '@rumsan/sdk/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'rpProject.campaign.create';
const UPDATE_CAMPAIGN = 'rpProject.campaign.update';
const CREATE_AUDIENCE = 'rpProject.campaign.create_audience';
const CREATE_BULK_AUDIENCE = 'rpProject.campaign.create_bulk_audience';
const GET_ALL_CAMPAIGN = 'rpProject.campaign.get';
const GET_CAMPAIGN = 'rpProject.campaign.getOne';
const GET_ALL_TRANSPORT = 'rpProject.campaign.get_transport';
const GET_ALL_AUDIENCE = 'rpProject.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'rpProject.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'rpProject.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'rpProject.campaign.communication_stats';
const GET_CAMPAIGN_LOGS = 'rpProject.campaign.log';

// Hooks for create campaign
export const useCreateCampaign = (projectUUID: UUID) => {
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
        queryKey: ['rpCampaignList'],
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
        queryKey: ['rpCampaignList'],
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

export const useTriggerRpCampaign = (projectUUID: UUID) => {
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
        queryKey: ['rpCampaignLogs'],
      });
      queryClient.invalidateQueries({
        queryKey: ['rpCampaign'],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Failed to trigger campaign.',
        icon: 'error',
      });
      queryClient.invalidateQueries({
        queryKey: ['rpCampaignLogs'],
      });
    },
  });
};

export const useListRpCampaign = (
  projectUUID: UUID,
  payload: Pagination & { [key: string]: string },
) => {
  const action = useProjectAction();

  const query = useQuery({
    queryKey: ['rpCampaignList', projectUUID, payload],
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

export const useListRpCampaignLog = (projectUUID: UUID, payload: any) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaignLogs', projectUUID, payload],
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

export const useGetRpCampaign = (projectUUID: UUID, uuid: string) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaign'],
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

export const useCreateRpAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_AUDIENCE,
          payload: data,
        },
      });
      return res.data;
    },
  });
};

export const useBulkCreateRpAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_BULK_AUDIENCE,
          payload: data,
        },
      });
      return res.data;
    },
  });
};

export const useListRpAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpListAudience', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_AUDIENCE,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useListRpTransport = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpListTransport', projectUUID],
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
