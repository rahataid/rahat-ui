'use client';

import { JwtPayload, decode } from 'jsonwebtoken';
import { useEffect, useMemo } from 'react';
import {
  useUserStore,
  useAuthStore,
  useUserCurrentUser,
  useUserRoleList,
} from '@rumsan/react-query';
import { toast } from 'react-toastify';
import { generateRoleObject } from '../utils/currentRole';
import { accessToken } from '../utils/tokens';

export type UseAuthInitializationReturn = [boolean, boolean, any];

export const useAuthInitialization = (): UseAuthInitializationReturn => {
  const {
    isAuthenticated,
    isInitialized,
    token,
    setInitialization,
    clearAuth,
  } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    isInitialized: state.isInitialized,
    setInitialization: state.setInitialization,
    clearAuth: state.clearAuth,
  }));
  const currentUser = useUserCurrentUser(!!token);

  const { clearUser, setUser } = useUserStore((state) => ({
    clearUser: state.clearUser,
    setUser: state.setUser,
  }));
  const currentUserRole = useUserRoleList(currentUser?.data?.data?.uuid);
  const currentRole = useMemo(
    () => generateRoleObject(currentUserRole?.data?.data || []),
    [currentUserRole],
  );

  useEffect(() => {
    if (token) {
      if (currentUser.isFetched) {
        if (currentUser.error || !currentUser.data?.data?.uuid) {
          clearAuth();
          clearUser();
          accessToken.remove();
          window.location.replace('/auth/login');
          return;
        }
      }

      try {
        const decodedToken = decode(token) as JwtPayload;
        const currentTime = Date.now() / 1000;
        if (
          decodedToken &&
          decodedToken.exp !== undefined &&
          decodedToken.exp > currentTime
        ) {
          const timeDifference = Math.abs(decodedToken.exp - currentTime) / 60;
          console.log('Token expires in:', timeDifference, 'minutes');
          setInitialization({
            isInitialized: true,
            isAuthenticated: true,
            roles: currentRole,
          });
        } else {
          toast.error('Token is expired');
          clearAuth();
          clearUser();
          accessToken.remove();
          window.location.replace('/auth/login');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setInitialization({
          isInitialized: true,
          isAuthenticated: false,
          token: '',
          roles: {},
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
  }, [token, setInitialization, currentUser.isFetched, currentUser.error, currentUser.data?.data?.uuid]);

  return [isAuthenticated, isInitialized, currentUser];
};
