import { create } from 'zustand';

const useStore = create((set) => ({
  extras: {},
  setExtras: (newExtras: any) => set({ extras: newExtras }),
  resetExtras: () => set({ extras: {} }),
}));

export default useStore;
