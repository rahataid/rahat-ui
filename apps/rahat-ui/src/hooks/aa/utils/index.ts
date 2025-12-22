import {
  PROJECT_SETTINGS_KEYS,
  useFundAssignmentStore,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useReadRahatTokenBalanceOf } from '../contracts/token';
import React from 'react';

export const useProjectBalance = (projectUUID: string) => {
  const contractSettings = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const setProjectBalance = useFundAssignmentStore(
    (state) => state.setProjectBalance,
  );

  const tokenBalanceQuery = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken.address as `0x${string}`,
    args: [contractSettings?.aaproject.address as `0x${string}`],
    query: {
      enabled: !!contractSettings,
      select(data) {
        return data ? Number(data) : null;
      },
    },
  });

  React.useEffect(() => {
    if (tokenBalanceQuery?.data) {
      setProjectBalance(tokenBalanceQuery?.data);
    }
  }, [tokenBalanceQuery?.data]);

  return tokenBalanceQuery;
};
