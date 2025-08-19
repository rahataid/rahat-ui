import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

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
  activitiesMeta: {},
};

type ActivitiesState = {
  categories: I[];
  phases: I[];
  hazardTypes: I[];
  activities: any;
  activitiesMeta: any;
};

type ActivitiesStateAction = {
  setCategories: (categories: I[]) => void;
  setPhases: (phases: I[]) => void;
  setHazardTypes: (hazardTypes: I[]) => void;
  setActivities: (activities: any) => void;
  setActivitiesMeta: (meta: any) => void;
};

type ActivitiesStore = ActivitiesState & ActivitiesStateAction;

export const useNotificationStore: UseBoundStore<StoreApi<ActivitiesStore>> =
  zustandStore<ActivitiesStore>(
    (set) => ({
      ...initialStore,
      setCategories: (categories) => set({ categories }),
      setPhases: (phases) => set({ phases }),
      setHazardTypes: (hazardTypes) => set({ hazardTypes }),
      setActivities: (activities) => set({ activities }),
      setActivitiesMeta: (meta) => set({ activitiesMeta: meta }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'notificationStore',
        storage: localStore,
      },
    },
  );
