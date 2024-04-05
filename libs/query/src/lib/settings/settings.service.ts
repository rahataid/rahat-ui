import { useMutation, useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';

//Never call this function directly, always use useAppSettings or useChainSettings
export const useAppSettingsMutate = (settingsName?: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const fetchSettings = async () => {
    const urlFunction = settingsName
      ? rumsanService.setting.getPublic(settingsName)
      : rumsanService.setting.listPublic();
    return urlFunction;
  };

  return useMutation(
    {
      mutationKey: ['settings', settingsName],
      mutationFn: fetchSettings,
    },
    queryClient,
  );
};

export const useChainSettings = () => {
  const { queryClient } = useRSQuery();
  const appSettings = useAppSettingsMutate('CHAIN_SETTINGS');

  return useQuery({
    queryKey: ['settings', 'CHAIN_SETTINGS'],
    queryFn: () => appSettings.mutate(),
    enabled: !!queryClient,
  });
};
