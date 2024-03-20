'use client';
import {
  BeneficiaryQuery,
  Settings,
  CommunityGroupQuery,
} from '@rahat-ui/community-query';
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
  communityBenQuery: BeneficiaryQuery;
  roleQuery: RoleQuery;
  communitySettingQuery: Settings;
  communityGroupQuery: CommunityGroupQuery;
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
    },
  );

  const authQuery = new AuthQuery(rumsanService, queryClient);
  const userQuery = new UserQuery(rumsanService, queryClient);
  const communityBenQuery = new BeneficiaryQuery(rumsanService, queryClient);
  const roleQuery = new RoleQuery(rumsanService, queryClient);
  const communitySettingQuery = new Settings(rumsanService, queryClient);
  const communityGroupQuery = new CommunityGroupQuery(
    rumsanService,
    queryClient,
  );

  return (
    <ServiceContext.Provider
      value={{
        rumsanService,
        authQuery,
        userQuery,
        communityBenQuery,
        roleQuery,
        communitySettingQuery,
        communityGroupQuery,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export const useRumsanService = (): ServiceContextType => {
  return useContext(ServiceContext) as ServiceContextType;
};
