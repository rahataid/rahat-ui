import { getBeneficiaryClient } from '@community-tool/sdk/clients';
import { BeneficiaryClient } from '@community-tool/sdk/types';
import { RumsanService } from '@rumsan/sdk';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

export class CommunityBeneficiaryQuery {
  private client: BeneficiaryClient;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getBeneficiaryClient(rsService.client);
  }

  useCommunityBeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: ['LIST_COMMUNITY_BENF', payload],
      queryFn: () => this.client.list(payload),
    });
  };
}
