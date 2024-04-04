'use client';

import { RumsanService } from '@rumsan/sdk';
import {
  RSQueryContextType,
  useAuthStore,
  useRSQuery,
} from '@rumsan/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useError } from '../utils/useErrors';
import { useCommunicationQuery } from '@rumsan/communication-query';
import { CommunicationService } from '@rumsan/communication/services/communication.client';
import Image from 'next/image';

export const ServiceContext = createContext<RSQueryContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const qc = useQueryClient();
  const { queryClient, rumsanService, setQueryClient, setRumsanService } =
    useRSQuery();
  const {
    communicationService,
    setCommunicationService,
    queryClient: commsQueryClient,
    setQueryClient: setCommsQueryClient,
  } = useCommunicationQuery();

  const rsService = useMemo(
    () =>
      new RumsanService({
        baseURL: process.env.NEXT_PUBLIC_API_HOST_URL + '/v1',
      }),
    [],
  );

  const commsService = useMemo(
    () =>
      new CommunicationService({
        baseURL: process.env.NEXT_PUBLIC_API_COMMUNICATION_URL + '/v1',
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

  useEffect(() => {
    if (!commsQueryClient) {
      setCommsQueryClient(qc);
    }
  }, [qc, commsQueryClient, setCommsQueryClient]);

  useEffect(() => {
    if (!communicationService) {
      setCommunicationService(commsService);
    }
  }, [commsService, communicationService, setCommunicationService]);

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

  useEffect(() => {
    if (communicationService) {
      communicationService.client.interceptors.request.use(
        (config) => {
          const token = useAuthStore.getState().token;
          if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
          }
          config.headers['appId'] = process.env.NEXT_PUBLIC_API_APPLICATION_ID;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    }
  }, [communicationService]);

  console.log('first', commsQueryClient);

  if (
    !rumsanService &&
    !queryClient &&
    !communicationService &&
    !commsQueryClient
  )
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

export const useRumsanService = () => {
  return useContext(ServiceContext);
};
