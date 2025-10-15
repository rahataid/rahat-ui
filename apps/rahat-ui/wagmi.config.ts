// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
'use client';

import { getDefaultConfig } from 'connectkit';
import { type Config, createConfig, http } from 'wagmi';
import {
  arbitrumSepolia,
  baseSepolia,
  mainnet,
  polygonMumbai,
  sepolia,
  polygon,
} from 'wagmi/chains';
import { safe } from 'wagmi/connectors';
import { rahatChain } from './src/chain-custom';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

export const config: Config = createConfig(
  getDefaultConfig({
    syncConnectedChain: true,
    chains: [
      // mainnet,
      // sepolia,
      // arbitrumGoerli,
      polygon,
      rahatChain,
      // baseSepolia,
      // polygonMumbai,
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
      [polygon.id]:http(),
      [rahatChain.id]: http(),
      // [mainnet.id]: http(),
      // [sepolia.id]: http(),
      // [arbitrumSepolia.id]: http(),
      // [polygonMumbai.id]: http(),
      // [baseSepolia.id]: http(),
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
