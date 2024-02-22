'use client';

import { WagmiProvider } from 'wagmi';
import { config } from '../wagmi.config';

export const Wagmi = ({ children }) => {
  return <WagmiProvider config={config}>{children}=</WagmiProvider>;
};
