import { localStore, zustandStore } from '@rumsan/react-query';

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

export const useAAStationsStore = zustandStore<AAStationsStore>(
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
