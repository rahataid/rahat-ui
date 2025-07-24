import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

const initialStore = {
  grievances: [],
  grievanceDetails: {},
};

type AAGrievancesState = {
  grievances: any;
  grievanceDetails: any;
};

type AAGrievancesStateAction = {
  setGrievances: (grievances: any) => void;
  setGrievanceDetails: (grievanceDetails: any) => void;
};

type AAGrievancesStore = AAGrievancesState & AAGrievancesStateAction;

export const useAAGrievancesStore: UseBoundStore<StoreApi<AAGrievancesStore>> =
  zustandStore<AAGrievancesStore>(
    (set) => ({
      ...initialStore,
      setGrievances: (grievances: any) => set({ grievances }),
      setGrievanceDetails: (grievanceDetails: any) => set({ grievanceDetails }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'aaGrievancesStore',
        storage: localStore,
      },
    },
  );
