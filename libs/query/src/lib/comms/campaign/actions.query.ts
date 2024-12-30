import { MS_ACTIONS } from '@rahataid/sdk';
import { Pagination } from '@rumsan/sdk/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'comms.campaign.create';
const UPDATE_CAMPAIGN = 'comms.campaign.update';
const CREATE_AUDIENCE = 'comms.campaign.create_audience';
const CREATE_BULK_AUDIENCE = 'comms.campaign.create_bulk_audience';
const GET_ALL_CAMPAIGN = 'comms.campaign.get';
const GET_CAMPAIGN = 'comms.campaign.getOne';
const GET_ALL_TRANSPORT = 'comms.campaign.get_transport';
const GET_ALL_AUDIENCE = 'comms.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'comms.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'comms.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'comms.campaign.communication_stats';
const GET_CAMPAIGN_LOGS = 'comms.campaign.log';

// Hooks for create campaign
export const useCreateCommsCampaign = (projectUUID: UUID) => {
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
        queryKey: ['commsCampaignList'],
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

export const useUpdateCommsCampaign = (projectUUID: UUID) => {
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
        queryKey: ['commsCampaignList'],
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

export const useTriggerCommsCampaign = (projectUUID: UUID) => {
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
        queryKey: ['commsCampaignLogs'],
      });
      queryClient.invalidateQueries({
        queryKey: ['commsCampaign'],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Failed to trigger campaign.',
        icon: 'error',
      });
      queryClient.invalidateQueries({
        queryKey: ['commsCampaignLogs'],
      });
    },
  });
};

export const useListCommsCampaign = (
  projectUUID: UUID,
  payload: Pagination & { [key: string]: string },
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsCampaignList', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_CAMPAIGN,
          payload: payload,
        },
      });
      return res.data;
    },
  });
};

export const useListCommsCommunicationStats = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsCampaignStats'],
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

export const useListCommsCommunicationLogs = (
  projectUUID: UUID,
  payload: Pagination & { [key: string]: string | number },
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsCommunicationLogs', projectUUID, payload],
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

export const useListCommsCampaignLog = (projectUUID: UUID, payload: any) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsCampaignLogs', projectUUID, payload],
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

export const useGetCommsCampaign = (projectUUID: UUID, uuid: string) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsCampaign'],
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

export const useCreateCommsAudience = (projectUUID: UUID) => {
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

export const useBulkCreateCommsAudience = (projectUUID: UUID) => {
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

export const useListCommsAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsListAudience', projectUUID],
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

export const useListCommsTransport = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['commsListTransport', projectUUID],
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
