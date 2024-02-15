import { createStore, localPersistStorage } from '../../utils/zustand-store';

type UserState = {
  user: any;
};

type UserStateAction = {
  setUser: (user: any) => void;
  clearUser: () => void;
};

type UserStore = UserState & UserStateAction;

export const useUserStore = createStore<UserStore>(
  (set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'userStore',
      storage: localPersistStorage,
    },
  }
);
