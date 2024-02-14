import { createStore } from '../utils/zustand-store';

const initialStore = {
  token: '',
};

type AuthState = {
  token: string;
};

type AuthStateAction = {
  setAuth: (creds: any) => void;
};

type AuthStore = AuthState & AuthStateAction;

export const useAuthStore = createStore<AuthStore>((set) => ({
  ...initialStore,
  setAuth: (creds) =>
    set({
      token: creds.token, // Fix: Use 'token' instead of 'creds'
    }),
}));
