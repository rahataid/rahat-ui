import { getSettingsClient } from '@rahataid/community-tool-sdk/clients';
import { SettingClient } from '@rahataid/community-tool-sdk/types';

import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { TAGS } from '../config';
import Swal from 'sweetalert2';
import { SettingInput } from '@rahataid/community-tool-sdk/settings/settings.types';

export class Settings {
  private client: SettingClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getSettingsClient(rsService.client);
    this.qc = reactQueryClient;
  }

  useCommunitySettingList = (): UseQueryResult<any, Error> => {
    return useQuery({
      queryKey: [TAGS.LIST_COMMUNITY_SETTINGS],
      queryFn: () => {
        return this.client.list();
      },
    });
  };

  useCommunitySettingCreate = () => {
    return useMutation({
      mutationKey: [TAGS.CREATE_COMMUNITY_SETTINGS],
      mutationFn: async (payload: SettingInput) => {
        return this.client.create(payload);
      },
      onSuccess: async (data) => {
        console.log(data);
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_SETTINGS],
        });
        Swal.fire({
          icon: 'success',
          title: 'Settings Created successfully',
        });
      },
      onError: (error: any) => {
        Swal.fire({
          icon: 'error',
          title:
            error.response.data.message ||
            'Encounter error on creating Settings',
        });
      },
    });
  };
}
