'use client';
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
import { getTranslate } from '../translate';

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
      queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES, { exact: true }, payload],
      queryFn: async () => await benClient.list(payload),
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
        const t = getTranslate();
        Swal.fire(t('BENEFICIARY_CREATED_SUCCESSFULLY'), '', 'success');
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
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('ERROR_ON_CREATING_DATA'),
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
        const t = getTranslate();
        Swal.fire(t('BENEFICIARY_UPDATED_SUCCESSFULLY'), '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES] });
      },
      onError: (error: any) => {
        console.log(error);
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error?.response?.data?.message || t('ERROR_ON_CREATING_DATA'),
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
        const t = getTranslate();
        Swal.fire(t('BENEFICIARY_REMOVED_SUCCESSFULLY'), '', 'success');
        qc.invalidateQueries({ queryKey: [TAGS.LIST_COMMUNITY_BENFICIARIES] });
      },
      onError: (error: any) => {
        const t = getTranslate();
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            t('ERROR_ON_REMOVING_DATA'),
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
        const t = getTranslate();
        Swal.fire(t('BENEFICIARY_CREATED_SUCCESSFULLY'), '', 'success');
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
        const t = getTranslate();
        Swal.fire({
          icon: 'error',
          title:
            error?.response?.data?.message ||
            t('ERROR_ON_CREATING_DATA'),
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

export const useListPalikas = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_PALIKA],
      queryFn: benClient.listDistinctLocations,
    },
    queryClient,
  );
};

export const useGenerateVerificationLink = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const benClient = getBeneficiaryClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.VERIFY_BENEFICIARY],
      mutationFn: benClient.verifyBeneficiary,
      onSuccess: () => {
        const t = getTranslate();
        Swal.fire({
          title: t('LINK_GENERATED_SUCCESSFULLY'),
          text: t('VERIFY_EMAIL_TEXT'),
          icon: 'success',
        });
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
        const t = getTranslate();
        Swal.fire(
          t('ERROR'),
          error.response.data.message || t('ERROR_ON_CREATING_DATA'),
          'error',
        );
      },
    },
    queryClient,
  );
};
