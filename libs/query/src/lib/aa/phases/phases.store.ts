import { localStore, zustandStore } from '@rumsan/react-query';

type Threshold = {
  name: string;
  mandatory: any;
  optional: any;
};

const initialStore = {
  phases: [],
  threshold: {
    name: '',
    mandatory: 0,
    optional: 0,
  },
};

type PhasesState = {
  phases: any[];
  threshold: Threshold;
};

type PhasesStateAction = {
  setPhases: (phase: any) => void;
  setThreshold: (threshold: any) => void;
};

type PhasesStore = PhasesState & PhasesStateAction;

export const usePhasesStore = zustandStore<PhasesStore>(
  (set) => ({
    ...initialStore,
    setPhases: (phases) => set({ phases }),
    setThreshold: (threshold: Threshold) => set({ threshold }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaPhasesStore',
      storage: localStore,
    },
  },
);
