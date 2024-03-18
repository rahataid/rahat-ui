import { getSettingsClient } from '@rahataid/community-tool-sdk/clients';
import { SettingClient } from '@rahataid/community-tool-sdk/types';

import { RumsanService } from '@rumsan/sdk';
import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

import { TAGS } from '../config';
import Swal from 'sweetalert2';
import { SettingInput } from '@rahataid/community-tool-sdk/settings/settings.types';

export class CommunitySettings {
  private client: SettingClient;
  public qc;

  constructor(rsService: RumsanService, reactQueryClient: QueryClient) {
    this.client = getSettingsClient(rsService.client);
    this.qc = reactQueryClient;
  }
  useCommunitySettingCreate = () => {
    return useMutation({
      mutationKey: [TAGS.CREATE_COMMUNITY_SETTINGS],
      mutationFn: async (payload: SettingInput) => {
        const response = this.client.create(payload);
        return response;
      },
      onSuccess: async (data) => {
        await this.qc.invalidateQueries({
          queryKey: [TAGS.LIST_COMMUNITY_SETTINGS],
        });
        Swal.fire({
          icon: 'success',
          title: 'Settings Created successfully',
        });
      },
      onError: (response) => {
        Swal.fire({
          icon: 'error',
          title: response || 'Encounter error on creating Settings',
        });
      },
    });
  };
}
