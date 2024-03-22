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
          beneficiaryId: payload?.selectedData,
          groupId: parseInt(value),
        };

        return this.client.create(inputData);
      },
      onSuccess: async (data) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP],
        });

        data &&
          Swal.fire({
            title: 'Beneficiaries Group has been created Sucessfully ',

            icon: 'success',
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
