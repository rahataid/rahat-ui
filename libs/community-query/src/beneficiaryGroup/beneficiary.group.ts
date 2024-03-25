import { getBeneficiaryGroupClient } from '@rahataid/community-tool-sdk/clients';
import { BeneficiaryGroupClient } from '@rahataid/community-tool-sdk/types';

import { RumsanService } from '@rumsan/sdk';
import { QueryClient, useMutation } from '@tanstack/react-query';

import { TAGS } from '../config';
import Swal from 'sweetalert2';

export class CommunityBeneficiaryGroupQuery {
  private client: BeneficiaryGroupClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getBeneficiaryGroupClient(rsService.client);
    this.qc = reactQueryClient;
  }

  useCommunityBeneficiaryGroupCreate = () => {
    return useMutation({
      mutationKey: [TAGS.ADD_COMMUNITY_BENEFICIARY_GROUP],
      mutationFn: async (payload: any) => {
        const { value } = await Swal.fire({
          title: 'Select Group',
          text: 'Select group for the beneficiary',
          showCancelButton: true,
          confirmButtonText: 'Create',
          cancelButtonText: 'Cancel',
          input: 'select',
          inputOptions: payload.inputOptions,
          inputPlaceholder: 'Select a project',
        });

        const inputData = {
          beneficiariesId: payload?.selectedData,
          groupId: parseInt(value),
        };

        return this.client.create(inputData as any);
      },
      onSuccess: async (data: any) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP],
        });

        data && data?.data?.info === false
          ? Swal.fire({
              text: data?.data?.finalMessage,
              icon: 'success',
            })
          : Swal.fire({
              title: data?.data?.finalMessage,
              titleText: data?.data?.finalMessage,
              text: data?.data?.info,

              icon: 'info',
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
