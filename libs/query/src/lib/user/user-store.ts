import { createStore, localPersistStorage } from '../../utils/zustand-store';

type UserState = {
  user: any;
  totalUser: number;
};

type UserStateAction = {
  setUser: (user: any) => void;
  clearUser: () => void;
  setTotalUser: (totalUser: number) => void;
};

type UserStore = UserState & UserStateAction;

export const useUserStore = createStore<UserStore>(
  (set) => ({
    user: null,
    totalUser: 0,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    setTotalUser: (totalUser) =>
      set({
        totalUser,
      }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'userStore',
      storage: localPersistStorage,
    },
  }
);
