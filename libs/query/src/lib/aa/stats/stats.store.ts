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
  phasesStats: {},
};

type StatsState = {
  phasesStats: any;
};

type StatsStateAction = {
  setPhasesStats: (stats: any) => void;
};

type StatsStore = StatsState & StatsStateAction;

export const useStatsStore: UseBoundStore<StoreApi<StatsStore>> =
  zustandStore<StatsStore>(
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
