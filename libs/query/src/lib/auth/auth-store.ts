import { createStore, localPersistStorage } from '../../utils/zustand-store';



type AuthState = {
  token: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any;
  error: any;
};

type AuthStateAction = {
  setAuth: (creds: any) => void;
};

type AuthStore = AuthState & AuthStateAction;

const initialStore = {
  token: '',
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  error: null,
};

export const useAuthStore = createStore<AuthStore>(
  (set) => ({
    ...initialStore,
    setAuth: (creds) =>
      set({
        token: creds.token, // Fix: Use 'token' instead of 'creds'
      }),
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'authStore',
      storage: localPersistStorage,
    },
  }
);
