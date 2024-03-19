'use client';
import { BeneficiaryQuery, CommunicationQuery } from '@rahat-ui/query';
import { AuthQuery, RoleQuery, UserQuery } from '@rumsan/react-query';
import { RumsanService } from '@rumsan/sdk';

import { CommunicationService } from '@rumsan/communication';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect } from 'react';
import { useError } from '../utils/useErrors';
import { useRSQuery } from '@rumsan/react-query/providers/rs-query-provider';

export type ServiceContextType = {
  rumsanService: RumsanService;
  communicationService: CommunicationService;
  communicationQuery: CommunicationQuery;
  authQuery: AuthQuery;
  userQuery: UserQuery;
  beneficiaryQuery: BeneficiaryQuery;
  roleQuery: RoleQuery;
};

export const ServiceContext = createContext<ServiceContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const qc = useQueryClient();
  const { queryClient, rumsanService, setQueryClient, setRumsanService } =
    useRSQuery();

  useEffect(() => {
    if (!queryClient) {
      setQueryClient(qc);
    }
  }, [qc, queryClient, setQueryClient]);

  useEffect(() => {
    if (!rumsanService) {
      setRumsanService(
        new RumsanService({
          baseURL: process.env.NEXT_PUBLIC_API_HOST_URL,
        }),
      );
    }
  }, [rumsanService, setRumsanService]);

  const communicationService = new CommunicationService({
    baseURL: process.env.NEXT_PUBLIC_API_COMMUNICATION_URL,
  });

  useError();

  // set bearer token
  // rumsanService.client.interceptors.request.use(
  //   (config) => {
  //     const token = useAuthStore.getState().token;
  //     if (token) {
  //       config.headers['Authorization'] = 'Bearer ' + token;
  //     }
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   },
  // );
  // // set bearer token
  // communicationService.client.interceptors.request.use(
  //   (config) => {
  //     const token = useAuthStore.getState().token;
  //     if (token) {
  //       config.headers['Authorization'] = 'Bearer ' + token;
  //     }
  //     config.headers['appId'] = process.env.NEXT_PUBLIC_API_APPLICATION_ID;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   },
  // );

  if (!rumsanService || !queryClient) return 'Setting up services...';

  return children;
}

export const useRumsanService = (): ServiceContextType => {
  return useContext(ServiceContext) as ServiceContextType;
};
