'use client ';

import { useSettingsStore } from '@rahat-ui/query';
import { ReactNode, useEffect } from 'react';
import { State, WagmiProvider } from 'wagmi';
import { config } from '../wagmi/wagmi.config';

type Props = {
  children: ReactNode;
  initialState: State | undefined;
  chainSettings: any;
};

export const Wagmi = async ({
  initialState,
  children,
  chainSettings,
}: Props) => {
  console.log('intialState', initialState);
  // const c = merge(config, chainSettings);

  // console.log('c', c);
  // await switchChain({ chain: d?.id }, { config });
  return (
    <WagmiProvider
      reconnectOnMount={true}
      initialState={initialState}
      config={config}
    >
      {children}
    </WagmiProvider>
  );
};
