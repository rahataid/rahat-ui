import { getBeneficiaryClient } from "@rahataid/community-tool-sdk/clients";
import { BeneficiaryClient } from "@rahataid/community-tool-sdk/types";
import {
  Beneficiary,
  UpdateBeneficiary,
} from "@rahataid/community-tool-sdk/beneficiary";

import { RumsanService } from "@rumsan/sdk";
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

import { TAGS } from "../config";

export class CommunityBeneficiaryQuery {
  private client: BeneficiaryClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getBeneficiaryClient(rsService.client);
    this.qc = reactQueryClient;
  }

  useCommunityBeneficiaryList = (payload: any): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
      queryFn: () => {
        return this.client.list(payload);
      },
    });
  };

  useCommunityBeneficiaryCreate = () => {
    return useMutation({
      mutationKey: [TAGS.CREATE_COMMUNITY_BENEFICARY],
      mutationFn: async (payload: any) => {
        console.log(payload);
        return this.client.create(payload);
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
        return this.client.update({ uuid, payload });
      },
      onSuccess: async (data) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });

        await this.qc.refetchQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES],
        });
      },
    });
  };
}
