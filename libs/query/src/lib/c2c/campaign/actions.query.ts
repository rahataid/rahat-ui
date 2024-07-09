import { MS_ACTIONS } from '@rahataid/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'c2cProject.campaign.create';
const CREATE_AUDIENCE = 'c2cProject.campaign.create_audience';
const GET_ALL_CAMPAIGN = 'c2cProject.campaign.get';
const GET_CAMPAIGN = 'c2cProject.campaign.getOne';
const GET_ALL_TRANSPORT = 'c2cProject.campaign.get_transport';
const GET_ALL_AUDIENCE = 'c2cProject.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'c2cProject.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'c2cProject.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'c2cProject.campaign.communication_stats';

// Hooks for create campaign
export const useCreateC2cCampaign = (projectUUID: UUID) => {
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
        queryKey: ['c2cCampaignList'],
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

export const useTriggerC2cCampaign = (projectUUID: UUID) => {
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
        queryKey: ['c2cCampaign'],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Failed to trigger campaign.',
        icon: 'error',
      });
      queryClient.invalidateQueries({
        queryKey: ['c2cCampaign'],
      });
    },
  });
};

export const useListC2cCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cCampaignList', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_CAMPAIGN,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useListC2cCommunicationStats = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cCampaignStats'],
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

export const useListC2cCommunicationLogs = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cCommunicationLogs', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_COMMUNICATION_LOGS,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useGetC2cCampaign = (projectUUID: UUID, id: number) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cCampaign'],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_CAMPAIGN,
          payload: { id },
        },
      });
      return res.data;
    },
  });
};

export const useCreateC2cAudience = (projectUUID: UUID) => {
  const action = useProjectAction();
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['c2cListAudience'] });
    },
  });
};

export const useListC2cAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cListAudience'],
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

export const useListC2cTransport = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cListTransport', projectUUID],
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
