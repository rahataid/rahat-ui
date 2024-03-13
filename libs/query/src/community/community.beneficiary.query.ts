import { getBeneficiaryClient } from '@rahataid/community-tool-sdk/clients';
import { BeneficiaryClient } from '@rahataid/community-tool-sdk/types';
import {
  Beneficiary,
  UpdateBeneficiary,
} from '@rahataid/community-tool-sdk/beneficiary';

import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { TAGS } from '../config';

export class CommunityBeneficiaryQuery {
  private client: BeneficiaryClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getBeneficiaryClient(rsService.client);
    this.qc = reactQueryClient;
  }

  useCommunityBeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES, payload],
      queryFn: () => this.client.list(payload),
    });
  };

  useCommunityBeneficiaryCreate = () => {
    return useMutation({
      mutationKey: [TAGS.CREATE_COMMUNITY_BENEFICARY],
      mutationFn: async (payload: any) => {
        console.log(payload);
        this.client.create(payload);
      },
      onSuccess: () => {
        this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });
      },
    });
  };

  useCommunityBeneficiaryUpdate = () => {
    return useMutation({
      mutationKey: [TAGS.UPDATE_COMMUNITY_BENEFICARY],
      mutationFn: async ({ uuid, payload }: { uuid: string; payload: any }) => {
        console.log('uuidpayload', payload);
        this.client.update({ uuid, payload });
      },
      onSuccess: () => {
        this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });
      },
    });
  };
}
