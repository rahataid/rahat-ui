import { UseQueryResult, useQuery, useMutation } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getTargetClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import Swal from 'sweetalert2';

export const useTargetingList = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_TARGETING],
      queryFn: () => targetingClient.list(),
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

export const useTargetedBeneficiaryList = (target_uuid: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const targetingClient = getTargetClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.GET_TARGETING_BENEFICIARIES, target_uuid],
      enabled: !!target_uuid,
      queryFn: () => targetingClient.listByTargetUuid(target_uuid),
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
        Swal.fire('Target Label Created Successfully', '', 'success');
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
