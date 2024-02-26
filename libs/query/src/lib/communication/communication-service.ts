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
import { createApiInstance } from '../../utils/api';

const baseURL = process.env['NEXT_PUBLIC_API_CAMPAIGN_URL'];

const api = createApiInstance(
  baseURL || '',
  'd8e29ab6-6876-43e4-9de1-e2e0d49d32cf'
);

const createCampaign = async (payload: CreateCampaignPayload) => {
  const res = await api.post('/campaigns', payload);
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
  const response = await api.get('/campaigns?' + searchParams);
  return response.data;
};

const useListCampaignQuery = (
  payload: PaginatedRequestPayload
): UseQueryResult<any, Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_CAMPAIGNS],
    queryFn: () => listCampaign(payload),
  });
};

const getCampaign = async (payload: { id: number }) => {
  const response = await api.get(`/campaigns/${payload.id}`);
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
  const response = await api.patch(`/campaigns/${payload.id}`, payload);
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
  const response = await api.delete(`/campaigns/${payload.id}`);
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
  const response = await api.get('/transports');
  return response.data;
};

const useListTransportQuery = (): UseQueryResult<Transport[], Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_TRANSPORT],
    queryFn: () => listTransport(),
  });
};

const listAudiences = async () => {
  const response = await api.get('/audiences');
  return response.data;
};

const useListAudienceQuery = (): UseQueryResult<Audience[], Error> => {
  return useQuery({
    queryKey: [TAGS.GET_ALL_AUDIENCE],
    queryFn: () => listAudiences(),
  });
};

const triggerCampaign = async (id: number) => {
  const response = await api.get(`/campaigns/${id}/trigger`);
  return response.data;
};

const useTriggerCampaignMutation = () => {
  return useMutation({
    mutationFn: (id: number) => triggerCampaign(id),
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
};
