'use client';
import { getSettingsClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { TAGS } from '../config';
import { useEffect } from 'react';
import { useSettingsStore } from './settings.store';

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
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.LIST_COMMUNITY_SETTINGS,
            {
              exact: true,
            },
          ],
        });
        Swal.fire('Settings Created Successfully', '', 'success');
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

export const useCommunitySettingUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: [TAGS.CREATE_COMMUNITY_SETTINGS],
      mutationFn: settingClient.update,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            TAGS.UPDATE_COMMUNITY_SETTINGS,
            {
              exact: true,
            },
          ],
        });
        Swal.fire('Settings Updated Successfully', '', 'success');
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
