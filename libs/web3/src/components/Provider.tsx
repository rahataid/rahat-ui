import type { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import type { Network } from '@web3-react/network';
import type { WalletConnect } from '@web3-react/walletconnect';
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import React from 'react';

import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from '../connectors/coinbaseWallet';
import { metaMask, hooks as metaMaskHooks } from '../connectors/metaMask';
import { network, hooks as networkHooks } from '../connectors/network';
import {
  walletConnect,
  hooks as walletConnectHooks,
} from '../connectors/walletConnect';
import {
  walletConnectV2,
  hooks as walletConnectV2Hooks,
} from '../connectors/walletConnectV2';
import { getName } from '../utils';

const connectors: [
  MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
];

function Child({ children }) {
  const { connector } = useWeb3React();
  console.log(`Priority Connector is: ${getName(connector)}`);
  return children;
}

export default function Web3Provider({ children }) {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child>{children} </Child>
    </Web3ReactProvider>
  );
}
