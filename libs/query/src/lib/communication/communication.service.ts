import { useEffect } from 'react';

import {
  PaginatedRequestPayload,
  CreateCampaignPayload,
  EditCampaignPayload,
  DeleteCampaignPayload,
  Transport,
  Audience,
  ICampaignItemApiResponse,
} from '@rahat-ui/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import queryString from 'query-string';
import { TAGS } from '../../config';
import { communicationApi } from '../../utils/api';

const createCampaign = async (payload: CreateCampaignPayload) => {
  const res = await communicationApi.post('/campaigns', payload);
  return res.data;
};

const useCreateCampaignMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => createCampaign(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_CAMPAIGNS] });
    },
  });
};

const listCampaign = async (payload: PaginatedRequestPayload) => {
  const searchParams = queryString.stringify({
    page: payload.page,
    perPage: payload.perPage,
    sort: payload.sort,
    order: payload.order,
  });
  const response = await communicationApi.get('/campaigns?' + searchParams);
  return response.data;
};

const useListCampaignQuery = (
  payload: PaginatedRequestPayload,
): UseQueryResult<any, Error> => {
  const listCampaignQueryResult = useQuery({
    queryKey: [TAGS.GET_ALL_CAMPAIGNS],
    queryFn: () => listCampaign(payload),
  });

  return listCampaignQueryResult;
};

const getCampaign = async (payload: { id: number }) => {
  const response = await communicationApi.get(`/campaigns/${payload.id}`);
  return response.data;
};

const useGetCampaignQuery = (payload: {
  id: number;
}): UseQueryResult<ICampaignItemApiResponse, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_CAMPAIGNS],
    queryFn: () => getCampaign(payload),
  });
};

const editCampaign = async (payload: EditCampaignPayload) => {
  const response = await communicationApi.patch(
    `/campaigns/${payload.id}`,
    payload,
  );
  return response.data;
};

const useEditCampaignsMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditCampaignPayload) => editCampaign(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_CAMPAIGNS] });
    },
  });
};

const deleteCampaign = async (payload: DeleteCampaignPayload) => {
  const response = await communicationApi.delete(`/campaigns/${payload.id}`);
  return response.data;
};

const useDeleteCampaignMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteCampaignPayload) => deleteCampaign(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_CAMPAIGNS] });
    },
  });
};

const listTransport = async () => {
  const response = await communicationApi.get('/transports');
  return response.data;
};

const useListTransportQuery = (): UseQueryResult<Transport[], Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_TRANSPORT],
    queryFn: () => listTransport(),
  });
};

const listAudiences = async () => {
  const response = await communicationApi.get('/audiences');
  return response.data;
};

const useListAudienceQuery = (): UseQueryResult<Audience[], Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_AUDIENCE],
    queryFn: () => listAudiences(),
  });
};

const triggerCampaign = async (id: number) => {
  const response = await communicationApi.get(`/campaigns/${id}/trigger`);
  return response.data;
};

const useTriggerCampaignMutation = () => {
  return useMutation({
    mutationFn: (id: number) => triggerCampaign(id),
  });
};

const getAudio = async () => {
  const response = await communicationApi.get(`/campaigns/audio`);
  return response.data;
};

const useGetAudioQuery = (): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_CAMPAIGNS_AUDIO],
    queryFn: () => getAudio(),
  });
};

export {
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
  useEditCampaignsMutation,
  useListCampaignQuery,
  useListTransportQuery,
  useListAudienceQuery,
  useTriggerCampaignMutation,
  useGetCampaignQuery,
  useGetAudioQuery,
};
