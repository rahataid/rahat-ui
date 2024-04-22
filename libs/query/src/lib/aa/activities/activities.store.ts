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
  activities: [],
};

type ActivitiesState = {
  categories: I[];
  phases: I[];
  hazardTypes: I[];
  activities: any;
};

type ActivitiesStateAction = {
  setCategories: (categories: I[]) => void;
  setPhases: (phases: I[]) => void;
  setHazardTypes: (hazardTypes: I[]) => void;
  setActivities: (activities: any) => void;
};

type ActivitiesStore = ActivitiesState & ActivitiesStateAction;

export const useActivitiesStore = zustandStore<ActivitiesStore>(
  (set) => ({
    ...initialStore,
    setCategories: (categories) => set({ categories }),
    setPhases: (phases) => set({ phases }),
    setHazardTypes: (hazardTypes) => set({ hazardTypes }),
    setActivities: (activities) => set({ activities }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaActivitiesStore',
      storage: localStore,
    },
  },
);
