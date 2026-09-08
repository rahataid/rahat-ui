import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

const initialStore = {
  stellarTokenStats: [],
  stellarTransaction: [],
  assignedFundData: {},
  projectBalance: null,
};

type FundAssignmentState = {
  stellarTokenStats: any;
  stellarTransaction: any;
  assignedFundData: any;
  projectBalance: number | null;
};

type FundAssignmentStateAction = {
  setAssignedFundData: (assignedFundData: any) => void;
  setStellarTokenStats: (stellarTokenStats: any) => void;
  setStellarTransaction: (stellarTransaction: any) => void;
  setProjectBalance: (projectBalance: number | null) => void;
};

type FundAssignmentStore = FundAssignmentState & FundAssignmentStateAction;

export const useFundAssignmentStore: UseBoundStore<
  StoreApi<FundAssignmentStore>
> = zustandStore<FundAssignmentStore>(
  (set) => ({
    ...initialStore,
    setAssignedFundData: (assignedFundData) => set({ assignedFundData }),
    setStellarTokenStats: (stellarTokenStats) => set({ stellarTokenStats }),
    setStellarTransaction: (stellarTransaction) => set({ stellarTransaction }),
    setProjectBalance: (projectBalance) => set({ projectBalance }),
  }),
  {
    devtoolsEnabled: true,
    // persistOptions: {
    //   name: 'aaFundAssignmentStore',
    //   storage: localStore,
    // },
  },
);
