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
    id: 80001,
    name: 'Rahat',
    nativeCurrency: { name: 'Rahat', symbol: 'Rs.', decimals: 18 },
    rpcUrls: {
      default: {
        http: [
          'https://polygon-mumbai.infura.io/v3/627efc2e63b5449eaf60728ea083fa9d',
          // 'wss://billowing-long-ensemble.arbitrum-sepolia.quiknode.pro/e0c76079c7d67ed114812420ba1d4472a30c93fa',
        ],
      },
    }
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
