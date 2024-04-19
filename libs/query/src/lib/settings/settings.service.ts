import { useRSQuery } from '@rumsan/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSettingsStore } from './settings.store';

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
  const { setChainSettings } = useSettingsStore();

  const query = useQuery(
    {
      queryKey: ['CHAIN_SETTINGS'],
      queryFn: async () => {
        const d = await appSettings.mutateAsync();
        return d.data.data?.value;
      },

      enabled: !!queryClient,
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setChainSettings(query.data);
    }
  }, [query.isSuccess, query.data, setChainSettings]);

  return query;
};

// export const useSubGraphUrlSettings = () => {
//   const { queryClient } = useRSQuery();
//   const appSettings = useAppSettingsMutate('SUBGRAPH_URL');
//   const { setSubGraphUrlSettings, subGraphUrl } = useSettingsStore();

//   const query = useQuery(
//     {
//       queryKey: ['SUBGRAPH_URL'],
//       queryFn: async () => {
//         const d = await appSettings.mutateAsync();
//         return d.data.data?.value;
//       },
//       enabled: !!queryClient,
//     },
//     queryClient,
//   );

//   useEffect(() => {
//     if (
//       query.isSuccess &&
//       query.data.length > 0 &&
//       query.data !== subGraphUrl
//     ) {
//       setSubGraphUrlSettings(query.data);
//     }
//   }, [query.isSuccess, query.data, setSubGraphUrlSettings]);

//   return query;
// };
