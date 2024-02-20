'use client';

import jwt from 'jsonwebtoken';
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
      try {
        const decodedToken = jwt.decode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken && decodedToken.exp > currentTime) {
          setInitialization({
            isInitialized: true,
            isAuthenticated: true,
          });
        } else {
          alert('Token is expired');
          throw new Error('Token is expired');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setInitialization({
          isInitialized: true,
          isAuthenticated: false,
          token: '',
        });
        setUser(null);
      }
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