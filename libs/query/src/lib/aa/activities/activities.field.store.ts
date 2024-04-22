import { localStore, zustandStore } from '@rumsan/react-query';

interface I {
  id: number;
  uuid: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
}

const initialStore = {
  categories: [],
  phases: [],
  hazardTypes: [],
  demoActivities: [],
};

type ActivitiesFieldState = {
  categories: I[];
  phases: I[];
  hazardTypes: I[];
  demoActivities: any;
};

type ActivitiesFieldStateAction = {
  setCategories: (categories: I[]) => void;
  setPhases: (phases: I[]) => void;
  setHazardTypes: (hazardTypes: I[]) => void;
  setDemoActivities: (demoActivities: any) => void;
};

type ActivitiesFieldStore = ActivitiesFieldState & ActivitiesFieldStateAction;

export const useActivitiesFieldStore = zustandStore<ActivitiesFieldStore>(
  (set) => ({
    ...initialStore,
    setCategories: (categories) => set({ categories }),
    setPhases: (phases) => set({ phases }),
    setHazardTypes: (hazardTypes) => set({ hazardTypes }),
    setDemoActivities: (demoActivities) => set({ demoActivities }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaActivitiesFieldStore',
      storage: localStore,
    },
  },
);
