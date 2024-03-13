import { getBeneficiaryClient } from '@rahataid/sdk/clients';
import { BeneficiaryClient } from '@rahataid/sdk/types';
import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { TAGS } from '../config';

export class BeneficiaryQuery {
  private reactQueryClient: QueryClient;
  private client: BeneficiaryClient;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = getBeneficiaryClient(rsService.client);
  }

  useBeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARIES, payload],
      queryFn: () => this.client.list(payload),
    });
  };

  useBeneficiaryGet = (uuid: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARY, uuid],
      // TODO: add to Service
      queryFn: () => this.client.list(uuid),
    });
  };
  useBeneficiaryPii = (): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARIES],
      queryFn: () => {
        return axios
          .get(`${process.env['NEXT_PUBLIC_API_HOST_URL']}/beneficiaries/pii`)
          .then(function (response) {
            return response.data;
          })
          .catch(function (error) {
            console.error('Error:', error);
            throw error;
          });
      },
    });
  };
  useVerifyBeneficiary = (payload: any): any => {
    return useMutation({
      mutationKey: [TAGS.VERIFY_BENEFICIARY, payload],
      mutationFn: (uuid: string) => {
        return fetch(
          `${process.env['NEXT_PUBLIC_API_HOST_URL']}/beneficiaries/generate-link/${uuid}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify(payload),
          },
        );
      }, //this.client.generateLink(payload),
    });
  };
}
