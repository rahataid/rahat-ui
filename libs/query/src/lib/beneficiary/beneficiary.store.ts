import { Beneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { localStore, zustandStore } from '@rumsan/react-query';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { StoreApi, UseBoundStore } from 'zustand';

type BeneficiaryState = {
  singleBeneficiary: FormattedResponse<Beneficiary>['data'] | null;
  beneficiaries: FormattedResponse<Beneficiary[]>['data'] | null;
  meta: FormattedResponse<Beneficiary>['response']['meta'];
  communityBeneficiariesUUID: string[] | [];
};

type BeneficiaryStateAction = {
  setSingleBeneficiary: (
    beneficiary: FormattedResponse<Beneficiary>['data'],
  ) => void;
  setBeneficiaries: (
    beneficiaries: FormattedResponse<Beneficiary[]>['data'],
  ) => void;
  resetBeneficiary: () => void;
  setMeta: (meta: any) => void;
  setCommunityBeneficiariesUUID: (communityBeneficiariesUUID: string[]) => void;
};

type BeneficiaryStore = BeneficiaryState & BeneficiaryStateAction;

const initialStore = {
  singleBeneficiary: null,
  beneficiaries: [],
  communityBeneficiariesUUID: [],
};

export const useBeneficiaryStore: UseBoundStore<StoreApi<BeneficiaryStore>> =
  zustandStore<BeneficiaryStore>(
    (set) => ({
      ...initialStore,
      meta: {},
      setSingleBeneficiary: (beneficiary) =>
        set({ singleBeneficiary: beneficiary }),
      setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
      resetBeneficiary: () => set({ ...initialStore }),
      setCommunityBeneficiariesUUID(communityBeneficiariesUUID) {
        set({ communityBeneficiariesUUID });
      },
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
