import {
  CommunicationService,
  CreateCampaign,
  EditCampaign,
  ICampaignItemApiResponse,
  Audio,
  Transport,
} from '@rumsan/communication';
import { Pagination } from '@rumsan/sdk/types';

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { TAGS } from '../config';

type createAudience = {
  details: {
    name: string;
    phone: string;
  };
};

export class CommunicationQuery {
  private reactQueryClient: QueryClient;
  private client: CommunicationService;

  constructor(client: CommunicationService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = client;
  }
  useCreateCampaign() {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (payload: CreateCampaign) =>
        this.client.communication.createCampaign(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_CAMPAIGNS] });
      },
    });
  }

  useCreateAudience() {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (payload: createAudience) => {
        return axios
          .post(
            `${process.env['NEXT_PUBLIC_API_COMMUNICATION_URL']}/audiences`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                appId: process.env['NEXT_PUBLIC_API_APPLICATION_ID'],
              },
            },
          )
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            console.error('Error:', error);
            throw error;
          });
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_AUDIENCE] });
      },
    });
  }

  useListCampaign(
    data: Pagination,
  ): UseQueryResult<{ data: { rows: ICampaignItemApiResponse[] } }, Error> {
    return useQuery({
      queryKey: [TAGS.GET_ALL_CAMPAIGNS],
      queryFn: () => this.client.communication.listCampaign(data),
    });
  }
  useUpdateCampaign() {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (payload: EditCampaign & { id: string }) =>
        this.client.communication.updateCampaign(payload.id, payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_CAMPAIGNS] });
      },
    });
  }

  useDeleteCampaign() {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => this.client.communication.deleteCampaign(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_CAMPAIGNS] });
      },
    });
  }

  useGetCampaign(payload: {
    id: number;
  }): UseQueryResult<{ data: ICampaignItemApiResponse }, Error> {
    return useQuery({
      queryKey: [TAGS.GET_CAMPAIGNS],
      queryFn: () => this.client.communication.getCampaign(payload.id),
    });
  }
  useGetAudio(): UseQueryResult<{ data: Audio[] }, Error> {
    return useQuery({
      queryKey: [TAGS.GET_CAMPAIGNS_AUDIO],
      queryFn: () => this.client.communication.getAudio(),
    });
  }
  useTriggerCampaign() {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => this.client.communication.triggerCampaign(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [TAGS.GET_CAMPAIGNS] });
      },
    });
  }
  useListAudience(): UseQueryResult<any, Error> {
    return useQuery({
      queryKey: [TAGS.GET_ALL_AUDIENCE],
      queryFn: () => this.client.communication.listAudience(),
    });
  }
  useListTransport(): UseQueryResult<{ data: Transport[] }, Error> {
    return useQuery({
      queryKey: [TAGS.GET_ALL_TRANSPORT],
      queryFn: () => this.client.communication.listTransport(),
    });
  }
}
