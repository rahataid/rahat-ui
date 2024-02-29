import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RumsanService } from '@rumsan/sdk';
import { getBeneficiaryClient } from '@rahataid/sdk/clients';
import { TAGS } from '../config';
import { BeneficiaryClient } from '@rahataid/sdk/types';

export class BeneficiaryQuery {
  private reactQueryClient: QueryClient;
  private client: BeneficiaryClient;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = getBeneficiaryClient(rsService.client);
  }

  usebeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARIES],
      queryFn: () => this.client.list(),
    });
  };
}
