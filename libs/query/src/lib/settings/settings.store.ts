import { zustandStore } from '@rumsan/react-query';
import { Chain, ChainFormatters } from 'viem';
import { localPersistStorage } from '../../utils/zustand-store';
import { useAppSettingsMutate } from './settings.service';


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
    id: Number(process.env['NEXT_PUBLIC_CHAIN_ID']) || 8888,
    name: process.env['NEXT_PUBLIC_CHAIN_NAME'] || 'Rahat',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [
          process.env['NEXT_PUBLIC_CHAIN_URL'] || 'http://localhost:8888'
        ],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },

  },
  subGraphUrl:
    process.env['NEXT_PUBLIC_SUBGRAPH_URL'] || "http://localhost:8000/subgraphs/name/rahat/el",
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
