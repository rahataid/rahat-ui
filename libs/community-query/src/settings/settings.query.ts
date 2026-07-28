'use client';
import { getSettingsClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { TAGS } from '../config';
import { useEffect } from 'react';
import { useSettingsStore } from './settings.store';
import { getTranslate } from '../translate';

export const useCommunitySettingList = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_SETTINGS, payload],
      queryFn: () => settingClient.listSettings(payload),
    },
    queryClient,
  );

  return query;
};

export const useCommunitySettingCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.CREATE_COMMUNITY_SETTINGS],
      mutationFn: settingClient.create,
      onSuccess: () => {
        const t = getTranslate();
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_SETTINGS,
            {
              exact: true,
            },
          ],
        });
        Swal.fire(t('SETTINGS_CREATED_SUCCESSFULLY'), '', 'success');
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

export const useCommunitySettingUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.CREATE_COMMUNITY_SETTINGS],
      mutationFn: settingClient.update,
      onSuccess: () => {
        const t = getTranslate();
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.UPDATE_COMMUNITY_SETTINGS,
            {
              exact: true,
            },
          ],
        });
        Swal.fire(t('SETTINGS_UPDATED_SUCCESSFULLY'), '', 'success');
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

export const useGetCommunitySettingByName = (
  name: string,
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_SETTINGS_NAME, name],
      queryFn: () => settingClient.getByName(name),
    },
    queryClient,
  );
};
