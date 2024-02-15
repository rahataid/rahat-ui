'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/auth';

export type UseAuthInitializationReturn = [boolean, boolean];

export const useAuthInitialization = (): UseAuthInitializationReturn => {
  const { isAuthenticated, isInitialized, token, setInitialization } =
    useAuthStore((state) => ({
      isAuthenticated: state.isAuthenticated,
      token: state.token,
      isInitialized: state.isInitialized,
      setInitialization: state.setInitialization,
    }));

  useEffect(() => {
    if (token) {
      setInitialization({
        isInitialized: true,
        isAuthenticated: true,
      });
    } else {
      setInitialization({
        isInitialized: true,
        isAuthenticated: false,
      });
    }
  }, [token, setInitialization]);

  return [isAuthenticated, isInitialized];
};
