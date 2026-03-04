import {
  PROJECT_SETTINGS_KEYS,
  useFundAssignmentStore,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  useReadRahatTokenBalanceOf,
  useReadRahatTokenDecimals,
} from '../contracts/token';
import React from 'react';
import { formatUnits } from 'viem';

export const useProjectBalance = (projectUUID: string) => {
  const contractSettings = useProjectSettingsStore(
    (state) =>
      state.settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  // const setProjectBalance = useFundAssignmentStore(
  //   (state) => state.setProjectBalance,
  // );

  const { data: tokenNumber } = useReadRahatTokenDecimals({
    address: contractSettings?.rahattoken?.address,
  });

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

  let projectBalance: string | undefined;

  if (tokenBalanceQuery?.data && tokenNumber) {
    projectBalance = formatUnits(
      BigInt(tokenBalanceQuery?.data),
      Number(tokenNumber),
    );
  }

  // React.useEffect(() => {
  //   if (tokenBalanceQuery?.data && tokenNumber) {
  //     const balance = formatUnits(
  //       BigInt(tokenBalanceQuery?.data),
  //       Number(tokenNumber),
  //     );
  //     setProjectBalance(Number(balance));
  //   }
  // }, [tokenBalanceQuery?.data]);

  return Number(projectBalance);
};
