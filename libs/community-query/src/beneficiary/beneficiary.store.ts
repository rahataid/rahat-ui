import {
  Beneficiary,
  ListBeneficiary,
} from '@rahataid/community-tool-sdk/beneficiary';
import { localStore, zustandStore } from '@rumsan/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';

type BeneficiaryState = {
  singleBeneficiary: FormattedResponse<Beneficiary>['data'] | null;
  beneficiaries: FormattedResponse<Beneficiary[]>['data'] | null;
  selectedBeneficiaries: FormattedResponse<ListBeneficiary[]>['data'] | null;
  meta: FormattedResponse<Beneficiary>['response']['meta'];
};

type BeneficiaryStateAction = {
  setSingleBeneficiary: (
    beneficiary: FormattedResponse<Beneficiary>['data'],
  ) => void;
  setBeneficiaries: (
    beneficiaries: FormattedResponse<Beneficiary[]>['data'],
  ) => void;
  setSelectedBeneficiaries: (
    beneficiaries: FormattedResponse<ListBeneficiary[]>['data'],
  ) => void;
  resetBeneficiary: () => void;
  setMeta: (meta: any) => void;
};

type BeneficiaryStore = BeneficiaryState & BeneficiaryStateAction;

const initialStore = {
  singleBeneficiary: null,
  beneficiaries: [],
  selectedBeneficiaries: [],
};

export const useCommunityBeneficiaryStore = zustandStore<BeneficiaryStore>(
  (set) => ({
    ...initialStore,
    meta: {},
    setSingleBeneficiary: (beneficiary) =>
      set({ singleBeneficiary: beneficiary }),
    setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
    setSelectedBeneficiaries: (selectedBeneficiaries) =>
      set({ selectedBeneficiaries }),
    resetBeneficiary: () => set({ ...initialStore }),
    setMeta: (meta: FormattedResponse<Beneficiary>['response']['meta']) =>
      set({ meta }),
  }),
  {
    devtoolsEnabled: true,
    // persistOptions: {
    //   name: 'beneficiaryStore',
    //   storage: localStore,
    // },
  },
);
