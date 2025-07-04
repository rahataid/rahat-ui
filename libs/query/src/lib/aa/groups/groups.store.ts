import { localStore, zustandStore } from '@rumsan/react-query';
import { useBeneficiariesGroups } from './groups.service';
import { StoreApi, UseBoundStore } from 'zustand';

const initialStore = {
  stakeholdersGroups: [],
  stakeholdersGroupsMeta: {},
  beneficiariesGroups: [],
  beneficiariesGroupsMeta: {},
};

type BeneficiariesGroupState = {
  beneficiariesGroups: any;
  beneficiariesGroupsMeta: any;
};

type StakeholdersGroupsState = {
  stakeholdersGroups: any;
  stakeholdersGroupsMeta: any;
};

type BeneficiariesGroupsStateAction = {
  setBeneficiariesGroup: (beneficiariesGroup: any) => void;
  setBeneficiariesGroupMeta: (meta: any) => void;
};

type StakeholdersGroupsStateAction = {
  setStakeholdersGroups: (stakeholdersGroups: any) => void;
  setStakeholdersGroupsMeta: (meta: any) => void;
};

type BeneficiariesGroupsStore = BeneficiariesGroupState &
  BeneficiariesGroupsStateAction;

type StakeholdersGroupsStore = StakeholdersGroupsState &
  StakeholdersGroupsStateAction;

export const useBeneficiariesGroupStore: UseBoundStore<
  StoreApi<BeneficiariesGroupsStore>
> = zustandStore<BeneficiariesGroupsStore>(
  (set) => ({
    ...initialStore,
    setBeneficiariesGroup: (beneficiariesGroups) =>
      set({ beneficiariesGroups }),
    setBeneficiariesGroupMeta: (meta) => set({ beneficiariesGroupsMeta: meta }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaBeneficiariesGroupStore',
      storage: localStore,
    },
  },
);

export const useStakeholdersGroupsStore: UseBoundStore<
  StoreApi<StakeholdersGroupsStore>
> = zustandStore<StakeholdersGroupsStore>(
  (set) => ({
    ...initialStore,
    setStakeholdersGroups: (stakeholdersGroups) => set({ stakeholdersGroups }),
    setStakeholdersGroupsMeta: (meta) => set({ stakeholdersGroupsMeta: meta }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaStakeholdersGroupStore',
      storage: localStore,
    },
  },
);
