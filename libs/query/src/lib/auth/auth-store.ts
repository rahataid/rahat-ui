import { createStore, localPersistStorage } from '../../utils/zustand-store';

type AuthState = {
  token: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  error: any;
  challenge: string;
  service: string;
  address: string;
};

type AuthStateAction = {
  setAuth: (creds: any) => void;
  setError: (error: any) => void;
  setChallenge: (challenge: string) => void;
  setService: (service: string) => void;
  setAddress: (address: string) => void;
  setToken: (token: string) => void;
  setInitialization: (d: any) => void;
};

type AuthStore = AuthState & AuthStateAction;

const initialStore = {
  token: '',
  isAuthenticated: false,
  isInitialized: false,
  error: null,
  challenge: '',
  service: 'EMAIL',
  address: '',
};

export const useAuthStore = createStore<AuthStore>(
  (set) => ({
    ...initialStore,
    setAuth: (creds) =>
      set({
        token: creds.token, // Fix: Use 'token' instead of 'creds'
      }),
    setError: (error) =>
      set({
        error,
      }),
    setChallenge: (challenge) =>
      set({
        challenge,
      }),
    setService: (service) =>
      set({
        service,
      }),
    setAddress: (address) =>
      set({
        address,
      }),
    setToken: (token) =>
      set({
        token,
      }),
    setInitialization(d) {
      set({
        ...d,
      });
    },
  }),
  {
    devtoolsEnabled: true,
    persistOptions: {
      name: 'authStore',
      storage: localPersistStorage,
    },
  }
);
