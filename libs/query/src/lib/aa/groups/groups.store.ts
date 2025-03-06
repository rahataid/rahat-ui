import { localStore, zustandStore } from '@rumsan/react-query';
import { useBeneficiariesGroups } from './groups.service';

const initialStore = {
  stakeholdersGroups: [],
  stakeholdersGroupsMeta: {},
  beneficiariesGroups: [],
  beneficiariesGroupsMeta: {},
  assignedFundData: {},
};

type BeneficiariesGroupState = {
  beneficiariesGroups: any;
  beneficiariesGroupsMeta: any;
};

type StakeholdersGroupsState = {
  stakeholdersGroups: any;
  stakeholdersGroupsMeta: any;
};

type FundAssignmentState = {
  assignedFundData: any;
};
type BeneficiariesGroupsStateAction = {
  setBeneficiariesGroup: (beneficiariesGroup: any) => void;
  setBeneficiariesGroupMeta: (meta: any) => void;
};

type StakeholdersGroupsStateAction = {
  setStakeholdersGroups: (stakeholdersGroups: any) => void;
  setStakeholdersGroupsMeta: (meta: any) => void;
};

type FundAssignmentStateAction = {
  setAssignedFundData: (assignedFundData: any) => void;
};
type BeneficiariesGroupsStore = BeneficiariesGroupState &
  BeneficiariesGroupsStateAction;

type StakeholdersGroupsStore = StakeholdersGroupsState &
  StakeholdersGroupsStateAction;

type FundAssignmentStore = FundAssignmentState & FundAssignmentStateAction;

export const useBeneficiariesGroupStore =
  zustandStore<BeneficiariesGroupsStore>(
    (set) => ({
      ...initialStore,
      setBeneficiariesGroup: (beneficiariesGroups) =>
        set({ beneficiariesGroups }),
      setBeneficiariesGroupMeta: (meta) =>
        set({ beneficiariesGroupsMeta: meta }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'aaBeneficiariesGroupStore',
        storage: localStore,
      },
    },
  );

export const useStakeholdersGroupsStore = zustandStore<StakeholdersGroupsStore>(
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

export const useFundAssignmentStore = zustandStore<FundAssignmentStore>(
  (set) => ({
    ...initialStore,
    setAssignedFundData: (assignedFundData) => set({ assignedFundData }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaFundAssignmentStore',
      storage: localStore,
    },
  },
);
