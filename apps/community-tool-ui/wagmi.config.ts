'use client';

import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { arbitrumSepolia, mainnet, sepolia } from 'wagmi/chains';
import { safe } from 'wagmi/connectors';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig(
  getDefaultConfig({
    chains: [
      // mainnet,
      // sepolia,
      // arbitrumGoerli,
      // polygon,
      // polygonMumbai,
      arbitrumSepolia,
      // rahatChain,
    ],
    batch: {
      multicall: true,
    },
    connectors: [
      // walletConnect({
      //   projectId: '1234',
      // }),
      safe(),
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
    },
    walletConnectProjectId: '',
    // Required App Info
    appName: 'Rahat',

    // Optional App Info
    appDescription:
      'An open-source blockchain-based financial access platform to support vulnerable communities.',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

// export default defineConfig({
//   out: 'src/generated.ts',
//   contracts: [],
//   plugins: [],
// });
