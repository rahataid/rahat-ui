import { create } from 'zustand';

const useStore = create((set) => ({
  importSource: '',
  setImportSource: (d: string) => set({ importSource: d }),
}));

export default useStore;
