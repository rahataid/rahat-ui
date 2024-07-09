import { MS_ACTIONS } from '@rahataid/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'cvaProject.campaign.create';
const CREATE_AUDIENCE = 'cvaProject.campaign.create_audience';
const GET_ALL_CAMPAIGN = 'cvaProject.campaign.get';
const GET_CAMPAIGN = 'cvaProject.campaign.getOne';
const GET_ALL_TRANSPORT = 'cvaProject.campaign.get_transport';
const GET_ALL_AUDIENCE = 'cvaProject.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'cvaProject.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'cvaProject.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'cvaProject.campaign.communication_stats';

// Hooks for create campaign
export const useCreateCvaCampaign = (projectUUID: UUID) => {
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
        queryKey: ['cvaCampaignList'],
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

export const useTriggerCvaCampaign = (projectUUID: UUID) => {
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
        queryKey: ['cvaCampaign'],
      });
    },
    onError: () => {
      toast.fire({
        title: 'Failed to trigger campaign.',
        icon: 'error',
      });
      queryClient.invalidateQueries({
        queryKey: ['cvaCampaign'],
      });
    },
  });
};

export const useListCvaCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['cvaCampaignList', projectUUID],
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

export const useListCvaCommunicationStats = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['cvaCampaignStats'],
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

export const useListCvaCommunicationLogs = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['cvaCommunicationLogs', projectUUID],
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

export const useGetCvaCampaign = (projectUUID: UUID, id: number) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['cvaCampaign'],
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

export const useCreateCvaAudience = (projectUUID: UUID) => {
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
      queryClient.invalidateQueries({ queryKey: ['cvaListAudience'] });
    },
  });
};

export const useListCvaAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['cvaListAudience'],
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

export const useListCvaTransport = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['cvaListTransport', projectUUID],
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
