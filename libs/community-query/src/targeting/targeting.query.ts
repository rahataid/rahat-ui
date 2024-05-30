import { UseQueryResult, useQuery, useMutation } from '@tanstack/react-query';
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

  return useMutation(
    {
      mutationKey: [TAGS.CREATE_TARGETING],
      mutationFn: targetingClient.create,
      onSuccess: () => {
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
      queryKey: [TAGS.GET_TARGETING_BENEFICIARIES, payload],
      queryFn: () =>
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
        Swal.fire('Target beneficiary pinned successfully', '', 'success');
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
