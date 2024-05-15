import { localStore, zustandStore } from '@rumsan/react-query';

const initialStore = {
  stakeholdersGroups: [],
  stakeholdersGroupsMeta: {},
};

type StakeholdersGroupsState = {
  stakeholdersGroups: any;
  stakeholdersGroupsMeta: any;
};

type StakeholdersGroupsStateAction = {
  setStakeholdersGroups: (stakeholdersGroups: any) => void;
  setStakeholdersGroupsMeta: (meta: any) => void;
};

type StakeholdersGroupsStore = StakeholdersGroupsState &
  StakeholdersGroupsStateAction;

export const useStakeholdersGroupsStore = zustandStore<StakeholdersGroupsStore>(
  (set) => ({
    ...initialStore,
    setStakeholdersGroups: (stakeholdersGroups) => set({ stakeholdersGroups }),
    setStakeholdersGroupsMeta: (meta) => set({ stakeholdersGroupsMeta: meta }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaGroupsStore',
      storage: localStore,
    },
  },
);
