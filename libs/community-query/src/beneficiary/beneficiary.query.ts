import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getBeneficiaryClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export const useCommunityBeneficaryList = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);

  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES, payload],
      queryFn: () => benClient.list(payload),
      select(data) {
        return {
          ...data,
          data: data.data.map((item) => {
            return {
              ...item,
              benUUID: item.uuid,
            };
          }, []),
        };
      },
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('data', query.data);
    }
  }, [query.data]);

  return query;
};

export const useCommunityBeneficiaryCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.CREATE_COMMUNITY_BENEFICARY],
      mutationFn: benClient.create,
      onSuccess: () => {
        Swal.fire('Beneficiary Created Successfully', '', 'success');
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_BENFICIARIES,
            {
              exact: true,
            },
          ],
        });
      },
      onError: (error: any) => {
        Swal.fire(
          'Error',
          error.message || 'Encounter error on Creating Data',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useCommunityBeneficiaryUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_COMMUNITY_BENEFICARY],
      mutationFn: benClient.update,
    },
    queryClient,
  );
};
