'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../lib/auth';
import { useGetCurrentUser, useUserStore } from '../lib/user';

export type UseAuthInitializationReturn = [boolean, boolean, any];

export const useAuthInitialization = (): UseAuthInitializationReturn => {
  const { isAuthenticated, isInitialized, token, setInitialization } =
    useAuthStore((state) => ({
      isAuthenticated: state.isAuthenticated,
      token: state.token,
      isInitialized: state.isInitialized,
      setInitialization: state.setInitialization,
    }));

  const currentUser = useGetCurrentUser(!!token);

  const setUser = useUserStore((state) => state.setUser);

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
      setUser(null);
    }
  }, [token, setInitialization]);

  return [isAuthenticated, isInitialized, currentUser];
};
