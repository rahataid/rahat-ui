import { zustandStore } from '@rumsan/react-query';
import { Chain, ChainFormatters } from 'viem';
import { localPersistStorage } from '../../utils/zustand-store';

export type AppSettingsState = {
  chainSettings: Chain<ChainFormatters>;
  subGraphUrl: string;
};

export type AppSettingsAction = {
  setChainSettings: (chainSettings: Chain<ChainFormatters>) => void;
  setSubGraphUrlSettings: (subGraphUrlSettings: string) => void;
};

export type AppSettings = AppSettingsState & AppSettingsAction;

export const initialAppSettings: AppSettingsState = {
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
  subGraphUrl:
    'https://api.studio.thegraph.com/query/42205/el-dev/version/latest',
};

export const useSettingsStore = zustandStore<AppSettings>(
  (set) => ({
    chainSettings: initialAppSettings.chainSettings,
    setChainSettings: (chainSettings) => set({ chainSettings }),
    subGraphUrl: initialAppSettings.subGraphUrl,
    setSubGraphUrlSettings: (subGraphUrl) => set({ subGraphUrl }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'appSettingsStore',
      storage: localPersistStorage,
    },
  },
);
