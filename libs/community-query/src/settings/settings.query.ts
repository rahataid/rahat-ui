import { getSettingsClient } from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import { SettingInput } from '@rahataid/community-tool-sdk/settings/settings.types';
import Swal from 'sweetalert2';

export const useCommunitySettingList = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_COMMUNITY_SETTINGS],
      queryFn: () => settingClient.list(),
    },
    queryClient,
  );
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
