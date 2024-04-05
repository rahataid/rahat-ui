import { zustandStore } from '@rumsan/react-query';
import { Chain, ChainFormatters } from 'viem';

export type ChainStoreState = {
  chainSettings: Chain<ChainFormatters>;
};

export type ChainStoreAction = {
  setChainSettings: (chainSettings: Chain<ChainFormatters>) => void;
};

export type ChainStore = ChainStoreState & ChainStoreAction;

export const initialChainSettings: ChainStoreState = {
  chainSettings: {
    id: 1,
    name: 'Rahat',
    nativeCurrency: { name: 'Rahat', symbol: 'Rs.', decimals: 18 },
    rpcUrls: {
      default: {
        http: [
          'https://polygon-mumbai.infura.io/v3/627efc2e63b5449eaf60728ea083fa9d',
          // 'wss://billowing-long-ensemble.arbitrum-sepolia.quiknode.pro/e0c76079c7d67ed114812420ba1d4472a30c93fa',
        ],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
    contracts: {
      ensRegistry: {
        address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
      },
      ensUniversalResolver: {
        address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
        blockCreated: 16773775,
      },
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14353601,
      },
    },
  },
};

export const useChainStore = zustandStore<ChainStore>((set) => ({
  chainSettings: initialChainSettings.chainSettings,
  setChainSettings: (chainSettings) => set({ chainSettings }),
}));
