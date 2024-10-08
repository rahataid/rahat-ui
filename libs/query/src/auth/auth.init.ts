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

export type UseAuthInitializationReturn = [boolean, boolean, any];

export const useAuthInitialization = (): UseAuthInitializationReturn => {
  const { isAuthenticated, isInitialized, token, setInitialization } =
    useAuthStore((state) => ({
      isAuthenticated: state.isAuthenticated,
      token: state.token,
      isInitialized: state.isInitialized,
      setInitialization: state.setInitialization,
    }));
  const currentUser = useUserCurrentUser(!!token);

  const setUser = useUserStore((state) => state.setUser);
  const currentUserRole = useUserRoleList(currentUser?.data?.data?.uuid);
  const currentRole = useMemo(
    () => generateRoleObject(currentUserRole?.data?.data || []),
    [currentUserRole],
  );

  useEffect(() => {
    if (token) {
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
          window.location.reload();
          throw new Error('Token is expired');
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
  }, [token, setInitialization]);

  return [isAuthenticated, isInitialized, currentUser];
};
