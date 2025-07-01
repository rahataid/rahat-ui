import { localStore, zustandStore } from '@rumsan/react-query';
import { StoreApi, UseBoundStore } from 'zustand';

const initialStore = {
  dhmStations: null,
  triggers: [],
};

type AAStationsState = {
  dhmStations: Record<string, any> | null;
  triggers: any[];
};

type AAStationsStateAction = {
  setDhmStations: (dhmStations: Record<string, any>) => void;
  resetDhmStations: () => void;
  setTriggers: (triggers: any) => void;
};

type AAStationsStore = AAStationsState & AAStationsStateAction;

export const useAAStationsStore: UseBoundStore<StoreApi<AAStationsStore>> =
  zustandStore<AAStationsStore>(
    (set) => ({
      ...initialStore,
      setDhmStations: (dhmStations) => set({ dhmStations }),
      resetDhmStations: () => set({ ...initialStore }),
      setTriggers: (triggers) => set({ triggers }),
    }),
    {
      devtoolsEnabled: true,
      persistOptions: {
        name: 'aaProjectStore',
        storage: localStore,
      },
    },
  );
