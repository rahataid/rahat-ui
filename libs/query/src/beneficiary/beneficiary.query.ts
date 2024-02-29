import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { RumsanService } from '@rumsan/sdk';
import { TAGS } from '../config';

export class BeneficiaryQuery {
  private reactQueryClient: QueryClient;
  private client: RumsanService;

  constructor(client: RumsanService, reactQueryClient: QueryClient) {
    this.reactQueryClient = reactQueryClient;
    this.client = client;
  }

  async beneficiaryList(payload: any) {
    const searchParams = {
      page: 1,
      perPage: 10,
      sort: 'createdAt',
      order: 'desc',
    };
    const response = await this.client.client(`/beneficiaries`, {
      params: searchParams,
    });
    return response?.data;
  }

  usebeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.GET_BENEFICIARIES],
      queryFn: () => this.beneficiaryList(payload),
    });
  };
}
