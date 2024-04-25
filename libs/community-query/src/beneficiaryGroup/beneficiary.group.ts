import { getBeneficiaryGroupClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { useMutation } from '@tanstack/react-query';
import { TAGS } from '../config';
import Swal from 'sweetalert2';

export const useCommunityBeneficiaryGroupCreate = () => {
  const { rumsanService, queryClient } = useRSQuery();
  const beneficiaryGroupClient = getBeneficiaryGroupClient(
    rumsanService.client,
  );
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
          beneficiaryUID: payload?.selectedData,
          groupUID: value,
        };
        return await beneficiaryGroupClient.create(inputData as any);
      }
      return null;
    },
    onSuccess: async (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP],
      });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP, { exact: true }],
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
        title:
          error.response.data.message || 'Encounter error on Creating Data',
      });
    },
  });
};
