import { createStore, localPersistStorage } from '../../utils/zustand-store';

type RoleState = {
  role: any;
};

type RoleStateAction = {
  setRole: (role: any) => void;
  clearRole: () => void;
};

type RoleStore = RoleState & RoleStateAction;

export const useRoleStore = createStore<RoleStore>(
  (set) => ({
    role: null,
    setRole: (role) => set({ role }),
    clearRole: () => set({ role: null }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'roleStore',
      storage: localPersistStorage,
    },
  }
);
