import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

export type RPProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: string;
      id: string;
    };
  };
};

export type RPProjectActions = {
  setProjectDetails: (
    projectDetails: RPProjectState['projectDetails'],
  ) => void;
};

export type RPProjectStore = RPProjectState & RPProjectActions;

const initialState: RPProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: '10000000000000000000',
      id: '',
    },
  },
};

export const useRPProjectSubgraphStore: UseBoundStore<
  StoreApi<RPProjectStore>
> = zustandStore<RPProjectStore>(
  (set, get) => ({
    ...initialState,
    setProjectDetails: (projectDetails) => {
      set({ projectDetails });
    },
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'rp-project-subgraph',
      storage: localStore,
    },
  },
);
