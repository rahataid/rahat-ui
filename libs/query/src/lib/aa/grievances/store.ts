import { localStore, zustandStore } from '@rumsan/react-query';

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

export const useAAGrievancesStore = zustandStore<AAGrievancesStore>(
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
