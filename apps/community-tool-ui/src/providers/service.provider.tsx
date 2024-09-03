'use client';
import { RumsanService } from '@rumsan/sdk';

import {
  RSQueryContextType,
  useAuthStore,
  useRSQuery,
} from '@rumsan/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useError } from '../utils/useErrors';
import Image from 'next/image';
import {
  useNewCommunicationQuery,
  useSettingsStore,
} from '@rahat-ui/community-query';
import { getClient } from '@rumsan/connect/src/clients';
import { isEmpty } from 'lodash';

export const ServiceContext = createContext<RSQueryContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const qc = useQueryClient();
  const { queryClient, rumsanService, setQueryClient, setRumsanService } =
    useRSQuery();
  const {
    newCommunicationService,
    newQueryClient: newCommsQueryClient,
    setNewCommunicationService,
    setNewQueryClient: setNewCommsQueryClient,
  } = useNewCommunicationQuery();

  const rsService = useMemo(
    () =>
      new RumsanService({
        baseURL: process.env.NEXT_PUBLIC_COMMUNITY_API_URL + '/v1',
      }),
    [],
  );

  const commsSettings = useSettingsStore((s) => s.commsSetting);
  console.log(newCommunicationService, 'commsSettings');
  useEffect(() => {
    if (!newCommunicationService && !isEmpty(commsSettings)) {
      const c = getClient({
        baseURL: commsSettings['URL'],
      });
      c.setAppId(commsSettings['APP_ID']);
      setNewCommunicationService(c);
    }
  }, [commsSettings, setNewCommunicationService, newCommunicationService]);

  useEffect(() => {
    if (!newCommsQueryClient) {
      setNewCommsQueryClient(qc);
    }
  }, [qc, newCommsQueryClient, setNewCommsQueryClient]);

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
    return (
      rumsanService &&
      queryClient &&
      newCommsQueryClient &&
      newCommunicationService
    );
  }, [
    rumsanService,
    queryClient,
    newCommsQueryClient,
    newCommunicationService,
  ]);

  console.log(isAppReady, 'isAppReady');
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
