import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getBeneficiaryClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useCommunityBeneficiaryStore } from './beneficiary.store';

export const useCommunityBeneficaryList = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  const { setBeneficiaries, setMeta } = useCommunityBeneficiaryStore(
    (state) => ({
      setBeneficiaries: state.setBeneficiaries,
      setMeta: state.setMeta,
    }),
  );
  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES, payload],
      queryFn: () => benClient.list(payload),
    },
    queryClient,
  );
  useEffect(() => {
    if (query.data) {
      //TODO: fix this type @karun-rumsan
      setBeneficiaries(query.data.data as any[]);
      setMeta(query.data.response.meta);
    }
  }, [query.data, setBeneficiaries]);

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
          error.response.data.message || 'Encounter error on Creating Data',
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
      onSuccess: () => {
        Swal.fire('Beneficiary Updated Successfully', '', 'success');
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
          error.response.data.message || 'Encounter error on Creating Data',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useCommunityBeneficiaryListByID = (): UseQueryResult<
  any,
  Error
> => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARY],
      queryFn: () => benClient.listById,
    },
    queryClient,
  );
};

export const useCommunityBeneficiaryRemove = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.REMOVE_COMMUNITY_BENEFICARY],
      mutationFn: benClient.remove,
      onSuccess: () => {
        Swal.fire('Beneficiary Removed Successfully', '', 'success');
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
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            'Encounter error on Removing Data',
        });
      },
    },
    queryClient,
  );
};

export const useCommunityBeneficiaryCreateBulk = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.CREATE_COMMUNITY_BENEFICARY],
      mutationFn: benClient.createBulk,
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
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            'Encounter error on Creating Data',
        });
      },
    },
    queryClient,
  );
};
