import { localStore, zustandStore } from '@rumsan/react-query';

interface I {
  id: number;
  uuid: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
}

const initialStore = {
  phasesStats: {}
};

type StatsState = {
  phasesStats: any;
};

type StatsStateAction = {
   setPhasesStats: (stats: any) => void;
};

type StatsStore = StatsState & StatsStateAction;

export const useStatsStore = zustandStore<StatsStore>(
  (set) => ({
    ...initialStore,
    setPhasesStats: (stats) => set({ phasesStats: stats }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaStatsStore',
      storage: localStore,
    },
  },
);
