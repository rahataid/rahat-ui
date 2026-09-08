import {
  UseQueryResult,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getTargetClient, getExportClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import Swal from 'sweetalert2';
import { Pagination } from '@rumsan/sdk/types';
import { getTranslate } from '../translate';

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
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('FAILED_TO_CREATE_TARGETING'),
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
  return useQuery(
    {
      queryKey: [TAGS.GET_TARGETING_BENEFICIARIES, target_uuid, payload],
      queryFn: () =>
        targetingClient.listByTargetUuid({
          target_uuid: target_uuid,
          query: payload,
        }),
    },
    queryClient,
  );



};

export const useTargetingLabelUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_TARGETING_LABEL],
      mutationFn: targetingClient.patchLabel,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire(t('BENEFICIARIES_ADDED_TO_GROUP'), '', 'success');
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
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('FAILED_TO_UPDATE_TARGETING_LABEL'),
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
  const exportClient = getExportClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.EXPORT_TARGETED_BENEFICIARIES],
      mutationFn: async (payload: any) => {
        const t = getTranslate();
        if (!payload.config || Object.keys(payload.config).length === 0) {
          await Swal.fire({
            icon: 'info',
            title: t('NO_SETTINGS_AVAILABLE'),
            text: t('ADD_APP_URL_FROM_SETTINGS'),
            confirmButtonText: t('OK'),
          });
          return null;
        }

        return Swal.fire({
          title: t('EXPORT_BENEFICIARY_TITLE'),
          showCancelButton: true,
          confirmButtonText: t('EXPORT'),
          cancelButtonText: t('CANCEL'),
          input: 'select',
          inputOptions: payload.config,
          inputPlaceholder: t('SELECT_APP_PLACEHOLDER'),
          preConfirm: (value) => {
            if (!value) {
              return Swal.showValidationMessage(
                t('SELECT_APP_TO_PROCEED'),
              );
            }
            return new Promise((resolve, reject) => {
              let confirmButton = Swal.getConfirmButton();
              if (!confirmButton) return;
              confirmButton.innerHTML = t('EXPORTING');
              confirmButton.disabled = true;
              const inputData = {
                groupUUID: payload?.groupUUID,
                appURL: value,
              };
              exportClient
                .exportBeneficiariesToApp(inputData as any)
                .then((data) => resolve(data))
                .catch((error) => reject(error));
            });
          },
        })
          .then((result) => {
            if (!result || !result.value) return;
            const tt = getTranslate();
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
            const tt = getTranslate();
            Swal.fire(
              tt('ERROR'),
              error?.response?.data?.message || tt('FAILED_TO_EXPORT_BENEFICIARY'),
              'error',
            );
          });
      },
    },

    queryClient,
  );
};
