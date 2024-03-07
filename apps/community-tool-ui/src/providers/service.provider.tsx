'use client';
import { CommunityBeneficiaryQuery } from '@rahat-ui/query';
import {
  AuthQuery,
  RoleQuery,
  UserQuery,
  useAuthStore,
} from '@rumsan/react-query';
import { RumsanService } from '@rumsan/sdk';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { useError } from '../utils/useErrors';

export type ServiceContextType = {
  rumsanService: RumsanService;
  authQuery: AuthQuery;
  userQuery: UserQuery;
  communityBenQuery: CommunityBeneficiaryQuery;
  roleQuery: RoleQuery;
};

export const ServiceContext = createContext<ServiceContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const queryClient = useQueryClient();
  const rumsanService = new RumsanService({
    baseURL: process.env.NEXT_PUBLIC_COMMUNITY_API_URL,
  });

  useError();

  // set bearer token
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
    }
  );

  const authQuery = new AuthQuery(rumsanService, queryClient);
  const userQuery = new UserQuery(rumsanService, queryClient);
  const communityBenQuery = new CommunityBeneficiaryQuery(
    rumsanService,
    queryClient
  );
  const roleQuery = new RoleQuery(rumsanService, queryClient);

  return (
    <ServiceContext.Provider
      value={{
        rumsanService,
        authQuery,
        userQuery,
        communityBenQuery,
        roleQuery,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export const useRumsanService = (): ServiceContextType => {
  return useContext(ServiceContext) as ServiceContextType;
};
