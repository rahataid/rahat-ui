import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

export type CambodiaProjectState = {
  cambodiaprojectDetails: {
    tokenBalance: {
      balance: string;
      id: string;
    };
  };
  projectTransactions: {};
};

export type CambodiaProjectActions = {
  setcambodiaprojectDetails: (cambodiaprojectDetails: CambodiaProjectState['cambodiaprojectDetails']) => void;
  setProjectTransactions: (
    transactions: CambodiaProjectState['projectTransactions'],
  ) => void;
};

export type CambodiaProjectStore = CambodiaProjectState & CambodiaProjectActions;

const initialState: CambodiaProjectState = {
  cambodiaprojectDetails: {
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

export const useCambodiaProjectSubgraphStore: UseBoundStore<
  StoreApi<CambodiaProjectStore>
> = zustandStore<CambodiaProjectStore>(
  (set, get) => ({
    ...initialState,
    setcambodiaprojectDetails: (cambodiaprojectDetails) => {
      set({ cambodiaprojectDetails });
    },
    setProjectTransactions: (projectTransactions) => {
      set({ projectTransactions });
    },
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'Cambodia-project-subgraph',
      storage: localStore,
    },
  },
);
