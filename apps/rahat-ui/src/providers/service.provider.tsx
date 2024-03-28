'use client';
import { RumsanService } from '@rumsan/sdk';

import { CommunicationService } from '@rumsan/communication';
import { useAuthStore, useRSQuery } from '@rumsan/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useError } from '../utils/useErrors';

export type ServiceContextType = {
  rumsanService: RumsanService;
  // communicationQuery: CommunicationQuery;
  communicationService: CommunicationService;
};

export const ServiceContext = createContext<ServiceContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [communicationService, setCommunicationService] =
    useState<CommunicationService>();
  // const [communicationQuery, setCommunicationQuery] =
  // useState<CommunicationQuery>();

  const qc = useQueryClient();
  const { queryClient, rumsanService, setQueryClient, setRumsanService } =
    useRSQuery();
  const rsService = useMemo(
    () =>
      new RumsanService({
        baseURL: process.env.NEXT_PUBLIC_API_HOST_URL + '/v1',
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
    if (!communicationService) {
      setCommunicationService(
        new CommunicationService({
          baseURL: process.env.NEXT_PUBLIC_API_COMMUNICATION_URL,
        }),
      );
    }
  }, [communicationService, setCommunicationService]);

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

  if (!rumsanService || !queryClient || !communicationService)
    return 'Setting up services...';

  return children;
}

export const useRumsanService = (): ServiceContextType => {
  return useContext(ServiceContext) as ServiceContextType;
};
