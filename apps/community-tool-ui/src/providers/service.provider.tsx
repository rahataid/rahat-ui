'use client';
import { RumsanService } from '@rumsan/sdk';

import {
  RSQueryContextType,
  useAuthStore,
  useRSQuery,
} from '@rumsan/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { createContext, useEffect, useMemo } from 'react';
import { useError } from '../utils/useErrors';

export const ServiceContext = createContext<RSQueryContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const qc = useQueryClient();
  const { queryClient, rumsanService, setQueryClient, setRumsanService } =
    useRSQuery();

  const rsService = useMemo(
    () =>
      new RumsanService({
        baseURL: process.env.NEXT_PUBLIC_COMMUNITY_API_URL + '/v1',
      }),
    [],
  );

  useEffect(() => {
    if (!queryClient) {
      setQueryClient(qc);
    }
  }, [qc, queryClient, setQueryClient]);

  useEffect(() => {
    if (!rumsanService) {
      setRumsanService(rsService);
    }
  }, [rsService, rumsanService, setRumsanService]);

  useError();

  useEffect(() => {
    if (rumsanService) {
      rumsanService.client.interceptors.request.use(
        (config) => {
          const token = useAuthStore.getState().token;
          if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    }
  }, [rumsanService]);

  const isAppReady = useMemo(() => {
    return rumsanService && queryClient;
  }, [rumsanService, queryClient]);

  if (!isAppReady)
    return (
      <div className="h-screen flex items-center justify-center">
        <Image
          className="animate-pulse"
          alt="rahat logo"
          src={'/rahat_logo_standard.png'}
          height={250}
          width={550}
        />
      </div>
    );

  return children;
}

// export const useRumsanService = (): RSQueryContextType => {
//   return useContext(ServiceContext) as RSQueryContextType;
// };
