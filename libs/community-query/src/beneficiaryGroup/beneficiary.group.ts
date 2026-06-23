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
      const inputData = {
        beneficiaryUID: payload?.selectedBeneficiaries,
        groupUID: payload?.grpUUID,
      };
      return await beneficiaryGroupClient.create(inputData as any);
    },
    onSuccess: async (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [
          TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP,
          TAGS.LIST_COMMUNITY_BENFICIARIES,
        ],
      });
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_BENEFICIARY_GROUP,
            TAGS.LIST_COMMUNITY_BENFICIARIES,
            { exact: true },
          ],
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

              icon: 'success',
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
