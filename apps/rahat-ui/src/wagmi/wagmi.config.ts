'use client';

import { getDefaultConfig } from 'connectkit';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet, polygonMumbai, sepolia } from 'wagmi/chains';
import { safe } from 'wagmi/connectors';
import { rahatChain } from './chain-custom';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig(
  getDefaultConfig({
    syncConnectedChain: true,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    chains: [
      // mainnet,
      // sepolia,
      // arbitrumGoerli,
      // polygon,
      // rahatChain,
      polygonMumbai,
      // arbitrumSepolia,
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
      [rahatChain.id]: http(
        'https://polygon-mumbai.infura.io/v3/627efc2e63b5449eaf60728ea083fa9d',
        {
          fetchOptions: {},
        },
      ),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      // [arbitrumSepolia.id]: http(),
      [polygonMumbai.id]: http(
        'https://polygon-mumbai.infura.io/v3/627efc2e63b5449eaf60728ea083fa9d',
      ),
    },
    walletConnectProjectId: '',
    // Required App Info
    appName: 'Rahat',

    // Optional App Info
    appDescription:
      'An open-source blockchain-based financial access platform to support vulnerable communities.',
    appUrl: 'https://nx.dev.rahat.io/', // your app's url
    appIcon: 'https://nx.dev.rahat.io/rahat-logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

// export default defineConfig({
//   out: 'src/generated.ts',
//   contracts: [],
//   plugins: [],
// });
