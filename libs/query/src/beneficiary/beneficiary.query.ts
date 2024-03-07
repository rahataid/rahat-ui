import { getBeneficiaryClient } from '@rahataid/sdk/clients';
import { BeneficiaryClient } from '@rahataid/sdk/types';
import { RumsanService } from '@rumsan/sdk';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
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
}
