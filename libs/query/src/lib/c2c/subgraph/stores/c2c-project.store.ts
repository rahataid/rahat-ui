import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

export type C2CProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: string;
      id: string;
    };
  };
};

export type C2CProjectActions = {
  setProjectDetails: (
    projectDetails: C2CProjectState['projectDetails']
  ) => void;
};

export type C2CProjectStore = C2CProjectState & C2CProjectActions;

const initialState: C2CProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: '10000000000000000000',
      id: '',
    },
  },
};

export const useC2CProjectSubgraphStore: UseBoundStore<
  StoreApi<C2CProjectStore>
> = zustandStore<C2CProjectStore>(
  (set, get) => ({
    ...initialState,
    setProjectDetails: (projectDetails) => {
      set({ projectDetails });
    },
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'c2c-project-subgraph',
      getStorage: () => localStore,
    },
  }
);
