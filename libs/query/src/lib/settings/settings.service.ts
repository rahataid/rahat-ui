'use client';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSettingsStore } from './settings.store';
import { Pagination } from '@rumsan/sdk/types';
import { getSettingsClient } from '@rahataid/sdk/clients';
import Swal from 'sweetalert2';

// const convertKeysToCamelCase = (obj:Record<string,any>):Record<string ,any>=> {
//   return mapKeys(obj, (value, key) => camelCase(key));
// };

//Never call this function directly, always use useAppSettings or useChainSettings
export const useAppSettingsMutate = (settingsName?: string) => {
  const { queryClient, rumsanService } = useRSQuery();

  const fetchSettings = async () => {
    const url = settingsName ? `/settings/${settingsName}` : '/settings';
    // const urlFunction = settingsName
    //   ? rumsanService.client.get(url)
    //   : rumsanService.setting.listPublic();
    const urlFunction = rumsanService.client.get(url);
    return urlFunction;
  };

  return useMutation(
    {
      mutationFn: fetchSettings,
    },
    queryClient,
  );
};

export const useChainSettings = () => {
  const { queryClient } = useRSQuery();
  // TODO:NEW is a temp name, will be changed to CHAIN_SETTINGS
  const appSettings = useAppSettingsMutate('CHAIN_SETTINGS');
  const { setProjectChainSettings } = useSettingsStore();

  const query = useQuery(
    {
      queryKey: ['CHAIN_SETTINGS'],
      queryFn: async () => {
        const d = await appSettings.mutateAsync();
        return d.data.data?.value || {};
      },

      enabled: !!queryClient,
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectChainSettings(query.data);
    }
  }, [query.isSuccess, query.data, setProjectChainSettings]);

  return query;
};

export const useAcessManagerSettings = () => {
  const { queryClient } = useRSQuery();
  const appSettings = useAppSettingsMutate('ACCESS_MANAGER');
  const { setAccessManagerSettings } = useSettingsStore();

  const query = useQuery(
    {
      queryKey: ['ACCESS_MANAGER'],
      queryFn: async () => {
        const d = await appSettings.mutateAsync();
        return d.data.data?.value || {};
      },

      enabled: !!queryClient,
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setAccessManagerSettings(query.data);
    }
  }, [query.isSuccess, query.data, setAccessManagerSettings]);

  return query;
};

// export const useRahatTreasurySettings = () => {
//   const { queryClient } = useRSQuery();
//   const appSettings = useAppSettingsMutate('RAHAT_TREASURY');
//   const { setRahatTreasurySettings } = useSettingsStore();

//   const query = useQuery(
//     {
//       queryKey: ['RAHAT_TREASURY'],
//       queryFn: async () => {
//         const d = await appSettings.mutateAsync();
//         return d.data.data?.value || {};
//       },

//       enabled: !!queryClient,
//     },
//     queryClient,
//   );

//   useEffect(() => {
//     if (query.isSuccess) {
//       setRahatTreasurySettings(query.data);
//     }
//   }, [query.isSuccess, query.data, setRahatTreasurySettings]);

//   return query;
// };

export const useAppContractSettings = () => {
  const { queryClient } = useRSQuery();

  const appSettings = useAppSettingsMutate('CONTRACTS');
  const { setContractSettings } = useSettingsStore();

  const query = useQuery(
    {
      queryKey: ['CONTRACTS'],
      queryFn: async () => {
        const d = await appSettings.mutateAsync();
        return d.data.data?.value || {};
      },

      enabled: !!queryClient,
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setContractSettings(query.data);
    }
  }, [query.isSuccess, query.data, setContractSettings]);

  return query;
};

export const useAppCommunicationSettings = () => {
  const { queryClient } = useRSQuery();

  const appSettings = useAppSettingsMutate('COMMUNICATION');
  const { setCommsSettings } = useSettingsStore();

  const query = useQuery(
    {
      queryKey: ['COMMUNICATION'],
      queryFn: async () => {
        const d = await appSettings.mutateAsync();
        return d.data.data?.value || {};
      },

      enabled: !!queryClient,
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setCommsSettings(query.data);
    }
  }, [query.isSuccess, query.data, setCommsSettings]);

  return query;
};

export const useAppNavSettings = () => {
  const { queryClient } = useRSQuery();

  const appSettings = useAppSettingsMutate('NAV_SETTINGS');
  const { setNavSettings } = useSettingsStore();

  const query = useQuery(
    {
      queryKey: ['NAV'],
      queryFn: async () => {
        const d = await appSettings.mutateAsync();
        return d.data.data?.value || {};
      },

      enabled: !!queryClient,
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setNavSettings(query?.data);
    }
  }, [query.isSuccess, query.data, setNavSettings]);

  return query;
};

// export const useAppSettingsCreate = (name: string) => {
//   const { queryClient, rumsanService } = useRSQuery();

//   const createSettings = async (data: {
//     value: Record<any, any>;
//     requiredFields: string[];
//     isReadOnly: boolean;
//     isPrivate: boolean;
//     dataType: SettingDataType;
//   }) => {
//     const url = `/app/settings`;
//     return rumsanService.client.post(url, {
//       name,
//       ...data,
//     });
//   };

//   return useMutation(
//     {
//       mutationKey: ['CREATE_SETTINGS', name],
//       mutationFn: createSettings,
//     },
//     queryClient,
//   );
// };

export const useAppSettingsCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: ['CREATE_SETTINGS'],
      mutationFn: settingClient.create,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'LIST_SETTINGS',
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

export const useRahatSettingList = (
  payload: Pagination & { any?: string },
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);

  // const settingClient = rumsanService.client.get('/settings');
  return useQuery(
    {
      queryKey: ['LIST_SETTINGS', payload],
      queryFn: () => settingClient.listSettings(payload),
    },
    queryClient,
  );
};

export const useRahatSettingUpdate = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useMutation(
    {
      mutationKey: ['UPDATE_SETTINGS'],
      mutationFn: settingClient.update,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'UPDATE_SETTINGS',
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

export const useGetRahatSettingByName = (
  name: string,
): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const settingClient = getSettingsClient(rumsanService.client);
  return useQuery(
    {
      queryKey: ['GET_COMMUNITY_SETTINGS_NAME', name],
      queryFn: () => settingClient.getByName(name),
    },
    queryClient,
  );
};
