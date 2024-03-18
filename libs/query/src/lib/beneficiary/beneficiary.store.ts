import { Beneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { localStore, zustandStore } from '@rumsan/react-query';

type BeneficiaryState = {
  singleBeneficiary: Beneficiary | null;
  beneficiaries: Beneficiary[];
};

type BeneficiaryStateAction = {
  setSingleBeneficiary: (beneficiary: Beneficiary) => void;
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void;
};

type AuthStore = BeneficiaryState & BeneficiaryStateAction;

const initialStore = {
  singleBeneficiary: null,
  beneficiaries: [],
};

export const useBeneficiaryStore = zustandStore<AuthStore>(
  (set) => ({
    ...initialStore,
    setSingleBeneficiary: (beneficiary) =>
      set({ singleBeneficiary: beneficiary }),
    setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'beneficiaryStore',
      storage: localStore,
    },
  },
);
