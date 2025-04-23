import { localStore, zustandStore } from '@rumsan/react-query';

const initialStore = {
  phases: [],
};

type PhasesState = {
  phases: any[];
};

type PhasesStateAction = {
  setPhases: (phase: any) => void;
};

type PhasesStore = PhasesState & PhasesStateAction;

export const usePhasesStore = zustandStore<PhasesStore>(
  (set) => ({
    ...initialStore,
    setPhases: (phases) => set({ phases }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaPhasesStore',
      storage: localStore,
    },
  },
);
