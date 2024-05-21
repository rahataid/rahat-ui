import { create } from 'zustand';

type Store = {
  deleteSelectedBeneficiariesFromImport: string[];
  setDeleteSelectedBeneficiariesFromImport: (
    deleteSelectedBeneficiariesFromImport: string[],
  ) => void;
  resetDeletedSelectedBeneficiaries: () => void;
};

const initialState = {
  deleteSelectedBeneficiariesFromImport: [],
};

export const useCommunityGroupStore = create<Store>((set) => ({
  ...initialState,
  setDeleteSelectedBeneficiariesFromImport: (
    deleteSelectedBeneficiariesFromImport,
  ) => set({ deleteSelectedBeneficiariesFromImport }),
  resetDeletedSelectedBeneficiaries: () => set({ ...initialState }),
}));
