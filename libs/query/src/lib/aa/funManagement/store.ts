import { localStore, zustandStore } from '@rumsan/react-query';

const initialStore = {
  stellarTokenStats: [],
  stellarTransaction: [],
  assignedFundData: {},
};

type FundAssignmentState = {
  stellarTokenStats: any;
  stellarTransaction: any;
  assignedFundData: any;
};

type FundAssignmentStateAction = {
  setAssignedFundData: (assignedFundData: any) => void;
  setStellarTokenStats: (stellarTokenStats: any) => void;
  setStellarTransaction: (stellarTransaction: any) => void;
};

type FundAssignmentStore = FundAssignmentState & FundAssignmentStateAction;

export const useFundAssignmentStore = zustandStore<FundAssignmentStore>(
  (set) => ({
    ...initialStore,
    setAssignedFundData: (assignedFundData) => set({ assignedFundData }),
    setStellarTokenStats: (stellarTokenStats) => set({ stellarTokenStats }),
    setStellarTransaction: (stellarTransaction) => set({ stellarTransaction }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaFundAssignmentStore',
      storage: localStore,
    },
  },
);
