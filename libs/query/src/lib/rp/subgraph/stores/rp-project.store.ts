import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

export type CVAProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: string;
      id: string;
    };
  };
};

export type CVAProjectActions = {
  setProjectDetails: (
    projectDetails: CVAProjectState['projectDetails'],
  ) => void;
};

export type CVAProjectStore = CVAProjectState & CVAProjectActions;

const initialState: CVAProjectState = {
  projectDetails: {
    tokenBalance: {
      balance: '10000000000000000000',
      id: '',
    },
  },
};

export const useCVAProjectSubgraphStore: UseBoundStore<
  StoreApi<CVAProjectStore>
> = zustandStore<CVAProjectStore>(
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
