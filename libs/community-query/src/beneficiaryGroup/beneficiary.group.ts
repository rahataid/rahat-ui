import { getBeneficiaryGroupClient } from '@rahataid/community-tool-sdk/clients';
import {
  BeneficiaryGroupClient,
  GroupClient,
} from '@rahataid/community-tool-sdk/types';

import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { TAGS } from '../config';
import Swal from 'sweetalert2';

export class CommunityBeneficiaryGroupQuery {
  private client: BeneficiaryGroupClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getBeneficiaryGroupClient(rsService.client);
    this.qc = reactQueryClient;
  }

  //   useCommunityBeneficiaryGroupList = (payload: any): UseQueryResult<any, Error> => {
  //     return useQuery({
  //       refetchOnMount: true,
  //       queryKey: [TAGS.LIST_COMMUNITY_GROUP, payload],
  //       queryFn: () => {
  //         return this.client.list(payload);
  //       },
  //     });
  //   };

  //   useCommunityGroupListByID = (id: string): UseQueryResult<any, Error> => {
  //     return useQuery({
  //       refetchOnMount: true,
  //       queryKey: [TAGS.LIST_COMMUNITY_GROUP_BY_ID],
  //       queryFn: () => {
  //         return this.client.listById(id);
  //       },
  //     });
  //   };

  useCommunityBeneficiaryGroupCreate = () => {
    return useMutation({
      mutationKey: [TAGS.ADD_COMMUNITY_BENEFICIARY_GROUP],
      mutationFn: async (payload: any) => {
        console.log('payload', payload);
        // return this.client.create(payload);
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP],
        });
        Swal.fire({
          icon: 'success',
          title: 'Group Created successfully',
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: error.message || 'Encounter error on Creating Data',
        });
      },
    });
  };
}
