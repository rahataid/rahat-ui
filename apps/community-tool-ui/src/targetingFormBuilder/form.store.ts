import { create } from 'zustand';
import { ITargetingQueries } from '../types/targeting';

interface ITargetingState {
  targetingQueries: ITargetingQueries;
  setTargetingQueries: (newTargetingQueries: ITargetingQueries) => void;
}

const useStore = create<ITargetingState>((set) => ({
  targetingQueries: {},
  setTargetingQueries: (newTargetingQueries: ITargetingQueries) =>
    set({ targetingQueries: newTargetingQueries }),
}));

export default useStore;
