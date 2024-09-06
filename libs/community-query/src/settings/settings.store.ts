import { create } from 'zustand';

type Store = {
  commsSetting: any;
  setCommsSetting: (commsSetting: any) => void;
};

const initialState = {
  commsSetting: {},
};

export const useSettingsStore = create<Store>((set) => ({
  ...initialState,
  setCommsSetting: (commsSetting: any) => set({ commsSetting }),
}));
