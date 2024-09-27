import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

export type KenyaProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: string;
      id: string;
    };
  };
  projectTransactions: {};
};

export type KenyaProjectActions = {
  setProjectDetails: (projectDetails: KenyaProjectState['projectDetails']) => void;
  setProjectTransactions: (
    transactions: KenyaProjectState['projectTransactions'],
  ) => void;
};

export type KenyaProjectStore = KenyaProjectState & KenyaProjectActions;

const initialState: KenyaProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: '10000000000000000000',
      id: '',
    },
  },
  projectTransactions: {
    claimCreateds: [],
    claimProcesseds: [],
    tokensAllocateds: [],
  },
};

export const useKenyaProjectSubgraphStore: UseBoundStore<
  StoreApi<KenyaProjectStore>
> = zustandStore<KenyaProjectStore>(
  (set, get) => ({
    ...initialState,
    setProjectDetails: (projectDetails) => {
      set({ projectDetails });
    },
    setProjectTransactions: (projectTransactions) => {
      set({ projectTransactions });
    },
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'Kenya-project-subgraph',
      storage: localStore,
    },
  },
);
