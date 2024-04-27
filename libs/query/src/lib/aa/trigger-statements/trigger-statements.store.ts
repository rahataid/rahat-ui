import { localStore, zustandStore } from '@rumsan/react-query';

const initialStore = {
  dhmStations: null,
};

type AAStationsState = {
  dhmStations: Record<string, any> | null;
};

type AAStationsStateAction = {
  setDhmStations: (dhmStations: Record<string, any>) => void;
  resetDhmStations: () => void;
};

type AAStationsStore = AAStationsState & AAStationsStateAction;

export const useAAStationsStore = zustandStore<AAStationsStore>(
  (set) => ({
    ...initialStore,
    setDhmStations: (dhmStations) => set({ dhmStations }),
    resetDhmStations: () => set({ ...initialStore }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'aaProjectStore',
      storage: localStore,
    },
  },
);
