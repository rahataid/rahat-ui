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
          title: 'Assign Group',
          text: 'Select group for the beneficiary',
          showCancelButton: true,
          confirmButtonText: 'Assign',
          cancelButtonText: 'Cancel',
          input: 'select',
          inputOptions: payload.inputOptions,
          inputPlaceholder: 'Select a Group',
          preConfirm: (selectedValue) => {
            if (!selectedValue) {
              Swal.showValidationMessage('Please select a group to proceed!');
            }
            return selectedValue;
          },
        });

        if (value !== undefined && value !== '') {
          const inputData = {
            beneficiariesId: payload?.selectedData,
            groupId: parseInt(value),
          };
          return await this.client.create(inputData as any);
        }
        return null;
      },
      onSuccess: async (data: any) => {
        if (data) {
          await this.qc.invalidateQueries({
            queryKey: [TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP],
          });

          data?.data?.info === false
            ? await Swal.fire({
                text: data?.data?.finalMessage,
                icon: 'success',
              })
            : await Swal.fire({
                title: data?.data?.finalMessage,
                titleText: data?.data?.finalMessage,
                text: data?.data?.info,

                icon: 'info',
              });
        }
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
