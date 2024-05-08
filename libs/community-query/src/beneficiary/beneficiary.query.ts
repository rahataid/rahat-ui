import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { getBeneficiaryClient } from '@rahataid/community-tool-sdk/clients';
import { TAGS } from '../config';
import { Pagination } from '@rumsan/sdk/types';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { Beneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { useCommunityBeneficiaryStore } from './beneficiary.store';

export const useCommunityBeneficaryList = (
  payload: Pagination & { [key: string]: string },
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
      setBeneficiaries(query.data.data as Beneficiary[]);
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
  const qc = useQueryClient();

  const benClient = getBeneficiaryClient(rumsanService.client);

  return useMutation(
    {
      mutationKey: [TAGS.UPDATE_COMMUNITY_BENEFICARY, 'uuid'],
      mutationFn: benClient.update,
      onSuccess: () => {
        Swal.fire('Beneficiary Updated Successfully', '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES] });
      },
      onError: (error: any) => {
        console.log(error);
        Swal.fire(
          'Error',
          error?.response?.data?.message || 'Encounter error on Creating Data',
          'error',
        );
      },
    },
    queryClient,
  );
};

export const useCommunityBeneficiaryListByID = ({
  uuid,
}: {
  uuid: string;
}): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_BENEFICIARY, uuid],
      queryFn: () => benClient.listById(uuid),
    },
    queryClient,
  );
};

export const useCommunityBeneficiaryRemove = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const qc = useQueryClient();

  const benClient = getBeneficiaryClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.REMOVE_COMMUNITY_BENEFICARY],
      mutationFn: benClient.remove,
      onSuccess: () => {
        Swal.fire('Beneficiary Removed Successfully', '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES] });
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

export const useCommunityBeneficiaryStatsList = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_COMMUNITY_BENEFICARY_STATS],
      //
      queryFn: benClient.getBeneficiaryStats,
    },
    queryClient,
  );
};
