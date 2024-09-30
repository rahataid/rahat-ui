import {
  UseQueryResult,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getTargetClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import Swal from 'sweetalert2';
import { Pagination } from '@rumsan/sdk/types';

export const useTargetingList = (
  payload: Pagination & { [key: string]: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_TARGETING, payload],
      queryFn: () => targetingClient.list(payload),
    },
    queryClient,
  );

  return query;
};

export const useTargetingCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);
  const qc = useQueryClient();

  return useMutation(
    {
      mutationKey: [TAGS.CREATE_TARGETING],
      mutationFn: targetingClient.create,
      onSuccess: () => {
        qc.invalidateQueries({
          queryKey: [TAGS.GET_TARGETING_BENEFICIARIES],
        });
      },
      onError: (error: any) => {
        Swal.fire(
          'Error',
          error.response.data.message || 'Failed to create targeting!',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useTargetedBeneficiaryList = (
  target_uuid: string,
  payload: Pagination,
) => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_TARGETING_BENEFICIARIES, target_uuid, payload],
      queryFn: () =>
        //@ts-ignore
        targetingClient.listByTargetUuid({
          target_uuid: target_uuid,
          query: payload,
        }),
    },
    queryClient,
  );

  return query;
};

export const useTargetingLabelUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_TARGETING_LABEL],
      mutationFn: targetingClient.patchLabel,
      onSuccess: () => {
        Swal.fire('Beneficiaries added to the group', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.GET_TARGETING_BENEFICIARIES,
            {
              exact: true,
            },
          ],
        });
      },
      onError: (error: any) => {
        Swal.fire(
          'Error',
          error.response.data.message || 'Failed to update targeting label!',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useDownloadPinnedListBeneficiary = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.DOWNLOAD_TARGETING_LABEL],
      mutationFn: targetingClient.downloadPinnedBeneficiary,
    },
    queryClient,
  );
};

export const useExportPinnedListBeneficiary = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.EXPORT_TARGETED_BENEFICIARIES],
      mutationFn: async (payload: any) => {
        if (!payload.config || Object.keys(payload.config).length === 0) {
          await Swal.fire({
            icon: 'info',
            title: 'No Settings Available',
            text: 'Please add app URL from settings',
            confirmButtonText: 'Ok',
          });
          return null;
        }

        return Swal.fire({
          title: 'Export Beneficiary',
          showCancelButton: true,
          confirmButtonText: 'Export',
          cancelButtonText: 'Cancel',
          input: 'select',
          inputOptions: payload.config,
          inputPlaceholder: '--Select Your App--',
          preConfirm: (value) => {
            if (!value) {
              return Swal.showValidationMessage(
                'Please select app to proceed!',
              );
            }
            return new Promise((resolve, reject) => {
              let confirmButton = Swal.getConfirmButton();
              if (!confirmButton) return;
              confirmButton.innerHTML = 'Exporting...';
              confirmButton.disabled = true;
              const inputData = {
                groupUUID: payload?.groupUUID,
                appURL: value,
              };
              targetingClient
                .exportTargetBeneficiary(inputData as any)
                .then((data) => resolve(data))
                .catch((error) => reject(error));
            });
          },
        })
          .then((result) => {
            if (!result || !result.value) return;
            Swal.fire(result?.value?.data?.message, '', 'success');
            queryClient.invalidateQueries({
              queryKey: [
                TAGS.LIST_COMMUNITY_BENFICIARIES,
                {
                  exact: true,
                },
              ],
            });
          })
          .catch((error) => {
            console.log('ExportError=>', error);
            Swal.fire(
              'Error',
              error?.response?.data?.message || 'Failed to export beneficiary!',
              'error',
            );
          });
      },
    },

    queryClient,
  );
};
