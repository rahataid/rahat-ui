import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

const initialStore = {
  stakeholders: [],
  stakeholdersMeta: {},
};

type StakeholdersState = {
  stakeholders: any[];
  stakeholdersMeta: any;
};

type StakeholdersStateAction = {
  setStakeholders: (stakeholders: any[]) => void;
  setStakeholdersMeta: (meta: any) => void;
};

type StakeholdersStore = StakeholdersState & StakeholdersStateAction;

export const useStakeholdersStore: UseBoundStore<StoreApi<StakeholdersStore>> =
  zustandStore<StakeholdersStore>(
    (set) => ({
      ...initialStore,
      setStakeholders: (stakeholders) => set({ stakeholders }),
      setStakeholdersMeta: (meta) => set({ stakeholdersMeta: meta }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'aaStakeholdersStore',
        storage: localStore,
      },
    },
  );
