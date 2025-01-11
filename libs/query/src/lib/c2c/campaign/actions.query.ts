import { MS_ACTIONS } from '@rahataid/sdk';
import { Pagination } from '@rumsan/sdk/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'c2cProject.campaign.create';
const UPDATE_CAMPAIGN = 'c2cProject.campaign.update';
const CREATE_AUDIENCE = 'c2cProject.campaign.create_audience';
const CREATE_BULK_AUDIENCE = 'c2cProject.campaign.create_bulk_audience';
const GET_ALL_CAMPAIGN = 'c2cProject.campaign.get';
const GET_CAMPAIGN = 'c2cProject.campaign.getOne';
const GET_ALL_TRANSPORT = 'c2cProject.campaign.get_transport';
const GET_ALL_AUDIENCE = 'c2cProject.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'c2cProject.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'c2cProject.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'c2cProject.campaign.communication_stats';
const GET_CAMPAIGN_LOGS = 'c2cProject.campaign.log';

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

export const useUpdateC2cCampaign = (projectUUID: UUID) => {
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
        queryKey: ['c2cCampaignList'],
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

export const useTriggerc2cCampaign = (projectUUID: UUID) => {
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
        queryKey: ['c2cCampaignLogs'],
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
        queryKey: ['c2cCampaignLogs'],
      });
    },
  });
};

export const useListc2cCampaign = (
  projectUUID: UUID,
  payload: Pagination & { [key: string]: string },
) => {
  const action = useProjectAction();

  const query = useQuery({
    queryKey: ['c2cCampaignList', projectUUID, payload],
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

export const useListc2cCommunicationStats = (projectUUID: UUID) => {
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

export const useListc2cCommunicationLogs = (projectUUID: UUID) => {
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

export const useListc2cCampaignLog = (projectUUID: UUID, payload: any) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cCampaignLogs', projectUUID, payload],
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

export const useGetc2cCampaign = (projectUUID: UUID, uuid: string) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cCampaign'],
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

export const useCreatec2cAudience = (projectUUID: UUID) => {
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

export const useBulkCreatec2cAudience = (projectUUID: UUID) => {
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

export const useListc2cAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['c2cListAudience', projectUUID],
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

export const useListc2cTransport = (projectUUID: UUID) => {
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
