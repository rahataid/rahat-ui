import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

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
  addPhase: (phase: any) => void;
  updatePhase: (uuid: string, data: any) => void;
  setThreshold: (threshold: any) => void;
};

type PhasesStore = PhasesState & PhasesStateAction;

export const usePhasesStore: UseBoundStore<StoreApi<PhasesStore>> =
  zustandStore<PhasesStore>(
    (set) => ({
      ...initialStore,
      setPhases: (phases) => set({ phases }),
      addPhase: (phase) =>
        set((state) => ({ phases: [...state.phases, phase] })),
      updatePhase: (uuid, data) =>
        set((state) => ({
          phases: state.phases.map((p) =>
            p.uuid === uuid ? { ...p, ...data } : p,
          ),
        })),
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
