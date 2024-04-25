import { create } from 'zustand';

const useStore = create((set) => ({
  targetingQueries: {},
  setTargetingQueries: (newTargetingQueries: any) =>
    set({ targetingQueries: newTargetingQueries }),
}));

export default useStore;
