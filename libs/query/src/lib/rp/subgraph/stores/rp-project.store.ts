import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

export type RPProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: string;
      id: string;
    };
  };
  projectTransactions:{
    claimCreateds:[],
    claimProcesseds:[],
    tokensAllocateds:[]
  }
};

export type RPProjectActions = {
  setProjectDetails: (
    projectDetails: RPProjectState['projectDetails'],
  ) => void;
  setProjectTransactions:(transactions:RPProjectState['projectTransactions']) =>void
};

export type RPProjectStore = RPProjectState & RPProjectActions;

const initialState: RPProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: '10000000000000000000',
      id: '',
    },
  },
  projectTransactions:{
    claimCreateds:[],
    claimProcesseds:[],
    tokensAllocateds:[]
  }
};

export const useRPProjectSubgraphStore: UseBoundStore<
  StoreApi<RPProjectStore>
> = zustandStore<RPProjectStore>(
  (set, get) => ({
    ...initialState,
    setProjectDetails: (projectDetails) => {
      set({ projectDetails });
    },
    setProjectTransactions:(projectTransactions) =>{
      set({projectTransactions})
    }

  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'rp-project-subgraph',
      storage: localStore,
    },
  },
);
