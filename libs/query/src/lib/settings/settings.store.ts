import { zustandStore } from '@rumsan/react-query';
import { Chain, ChainFormatters } from 'viem';
import { localPersistStorage } from '../../utils/zustand-store';
import { StoreApi, UseBoundStore } from 'zustand';

export type AppSettingsState = {
  chainSettings: Chain<ChainFormatters>;
  subGraphUrl: string;
  accessManager: string;
  // rahatTreasury: string;
  contracts: Record<string, any>;
  navSettings: Record<string, any>;
  roleOnChainSync: any;
  commsSettings: Record<string, any>;
};

export type AppSettingsAction = {
  setChainSettings: (chainSettings: Chain<ChainFormatters>) => void;
  setSubGraphUrlSettings: (subGraphUrlSettings: string) => void;
  setAccessManagerSettings: (accessManager: `0X${string}`) => void;
  // setRahatTreasurySettings: (rahatTreasury: `0X${string}`) => void;
  setContractSettings: (contracts: Record<string, string>) => void;
  setNavSettings: (navSettings: Record<string, any>) => void;
  setRoleSync: (roleOnChainSync: any) => void;
  setCommsSettings: (commsSettings: Record<string, any>) => void;
};

export type AppSettings = AppSettingsState & AppSettingsAction;

export const initialAppSettings: AppSettingsState = {
  chainSettings: {
    id: Number(process.env['NEXT_PUBLIC_CHAIN_ID']) || 8888,
    name: process.env['NEXT_PUBLIC_CHAIN_NAME'] || 'Rahat',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [process.env['NEXT_PUBLIC_CHAIN_URL'] || 'http://localhost:8888'],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://etherscan.io' },
    },
  },
  subGraphUrl:
    process.env['NEXT_PUBLIC_SUBGRAPH_URL'] ||
    'http://localhost:8000/subgraphs/name/rahat/rp',
  accessManager:
    process.env['NEXT_PUBLIC_ACCESS_MANAGER'] ||
    '0x047435DE08F97c6446fcB0302140340559652F83',
  // rahatTreasury:
  //   process.env['NEXT_PUBLIC_RAHAT_TREASURY'] ||
  //   '0x047435DE08F97c6446fcB0302140340559652F83',
  contracts: {},
  navSettings: {
    data: [],
    subData: [],
  },
  roleOnChainSync: process.env['NEXT_PUBLIC_ADD_ROLE_ON_CHAIN'] || false,
  commsSettings: {},
};

export const useSettingsStore: UseBoundStore<StoreApi<AppSettings>> =
  zustandStore<AppSettings>(
    (set) => ({
      chainSettings: initialAppSettings.chainSettings,
      contracts: initialAppSettings.contracts,
      setChainSettings: (chainSettings) => set({ chainSettings }),
      subGraphUrl: initialAppSettings.subGraphUrl,
      setSubGraphUrlSettings: (subGraphUrl) => set({ subGraphUrl }),
      accessManager: initialAppSettings.accessManager,
      setAccessManagerSettings: (accessManager) => set({ accessManager }),
      // rahatTreasury: initialAppSettings.rahatTreasury,
      // setRahatTreasurySettings: (rahatTreasury) => set({ rahatTreasury }),
      setContractSettings: (contracts) => set({ contracts }),
      navSettings: initialAppSettings.navSettings,
      setNavSettings: (navSettings) => set({ navSettings }),
      roleOnChainSync: initialAppSettings.roleOnChainSync,
      setRoleSync: (roleOnChainSync) => set({ roleOnChainSync }),
      commsSettings: initialAppSettings.commsSettings,
      setCommsSettings: (commsSettings) => set({ commsSettings }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'appSettingsStore',
        storage: localPersistStorage,
      },
    },
  );
