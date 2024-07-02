import { MS_ACTIONS } from '@rahataid/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_CAMPAIGN = 'rpProject.campaign.create';
const CREATE_AUDIENCE = 'rpProject.campaign.create_audience';
const GET_ALL_CAMPAIGN = 'rpProject.campaign.get';
const GET_CAMPAIGN = 'rpProject.campaign.getOne';
const GET_ALL_TRANSPORT = 'rpProject.campaign.get_transport';
const GET_ALL_AUDIENCE = 'rpProject.campaign.get_audience';
const TRIGGER_CAMPAIGN = 'rpProject.campaign.trigger';
const GET_ALL_COMMUNICATION_LOGS = 'rpProject.campaign.communication_logs';
const GET_ALL_COMMUNICATION_STATS = 'rpProject.campaign.communication_stats';

// Hooks for create campaign
export const useCreateCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();

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
  });
};

export const useTriggerRpCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();

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
  });
};

export const useListRpCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaignList', projectUUID],
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

export const useListRpCommunicationStats = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaignStats', projectUUID],
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

export const useListRpCommunicationLogs = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCommunicationLogs', projectUUID],
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

export const useGetRpCampaign = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaign', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_CAMPAIGN,
          payload: {},
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

export const useListRpAudience = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaignList', projectUUID],
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
    queryKey: ['rpCampaignList', projectUUID],
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
