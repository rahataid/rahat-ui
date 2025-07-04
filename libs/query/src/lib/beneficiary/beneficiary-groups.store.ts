import { Beneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { localStore, zustandStore } from '@rumsan/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { StoreApi, UseBoundStore } from 'zustand';
// import { ListBeneficiaryGroup } from 'libs/types/src';
// import { ListBeneficiaryGroup } from 'libs/types/src';

interface ListBeneficiaryGroup {
  id: number;
  uuid: string;
  name: string;
  totalMembers: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type BeneficiaryGroupState = {
  singleBeneficiaryGroup: ListBeneficiaryGroup | null;
  beneficiaries: ListBeneficiaryGroup[] | null;
  meta: any;
};

type BeneficiaryGroupStateAction = {
  setSingleBeneficiaryGroup: (beneficiary: ListBeneficiaryGroup) => void;
  setBeneficiaryGroups: (beneficiaries: ListBeneficiaryGroup[]) => void;
  resetBeneficiaryGroups: () => void;
  setMeta: (meta: any) => void;
};

type BeneficiaryGroupsStore = BeneficiaryGroupState &
  BeneficiaryGroupStateAction;

const initialStore = {
  singleBeneficiaryGroup: null,
  beneficiaries: [],
};

export const useBeneficiaryGroupsStore: UseBoundStore<
  StoreApi<BeneficiaryGroupsStore>
> = zustandStore<BeneficiaryGroupsStore>(
  (set) => ({
    ...initialStore,
    meta: {},
    setSingleBeneficiaryGroup: (beneficiary) =>
      set({ singleBeneficiaryGroup: beneficiary }),
    setBeneficiaryGroups: (beneficiaries) => set({ beneficiaries }),
    resetBeneficiaryGroups: () => set({ ...initialStore }),
    setMeta: (meta: any) => set({ meta }),
  }),
  {
    devtoolsEnabled: true,
    // persistOptions: {
    //   name: 'beneficiaryStore',
    //   storage: localStore,
    // },
  },
);
