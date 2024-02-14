export * as chains from './chains';
export * as utils from './utils';

export * from './connectors/coinbaseWallet';
export {
  hooks as coinbaseHooks,
  coinbaseWallet,
} from './connectors/coinbaseWallet';
export { metaMask, hooks as metaMaskHooks } from './connectors/metaMask';
export { network, hooks as networkHooks } from './connectors/network';
export {
  walletConnect,
  hooks as walletConnectHooks,
} from './connectors/walletConnect';
export {
  walletConnectV2,
  hooks as walletConnectV2Hooks,
} from './connectors/walletConnectV2';
export { getName } from './utils';

export * from '@web3-react/core';
export * from '@web3-react/metamask';
export * from '@web3-react/types';

export { default as Web3ReactProvider } from './components/Provider';

export { default as MetamaskCard } from './components/connectorCards/MetaMaskCard';
