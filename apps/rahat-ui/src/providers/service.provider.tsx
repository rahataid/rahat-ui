'use client';

import {
  useAcessManagerSettings,
  // useRahatTreasurySettings,
  useAppContractSettings,
  useAppNavSettings,
  useSettingsStore,
  useAppCommunicationSettings,
} from '@rahat-ui/query';
import { useCommunicationQuery } from '@rumsan/communication-query';
import { CommunicationService } from '@rumsan/communication/services/communication.client';
import {
  RSQueryContextType,
  useAuthStore,
  useRSQuery,
} from '@rumsan/react-query';
import { RumsanService } from '@rumsan/sdk';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useError } from '../utils/useErrors';
import { useNewCommunicationQuery } from '@rahat-ui/query';
import { getClient } from '@rumsan/connect/src/clients';
import { isEmpty } from 'lodash';

export const ServiceContext = createContext<RSQueryContextType | null>(null);

interface ServiceProviderProps {
  children: React.ReactNode;
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  // will hold all of the api call until, user is authenticated and the app is ready to be used
  const { isAuthenticated } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
  }));

  const qc = useQueryClient();
  const { queryClient, rumsanService, setQueryClient, setRumsanService } =
    useRSQuery();
  const {
    communicationService,
    setCommunicationService,
    queryClient: commsQueryClient,
    setQueryClient: setCommsQueryClient,
  } = useCommunicationQuery();

  const {
    newCommunicationService,
    newQueryClient: newCommsQueryClient,
    setNewCommunicationService,
    setNewQueryClient: setNewCommsQueryClient,
  } = useNewCommunicationQuery();

  const chainSettings = useSettingsStore((s) => s.chainSettings);

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
  useAcessManagerSettings(isAuthenticated);
  // useRahatTreasurySettings();
  useAppContractSettings(isAuthenticated);
  useAppNavSettings(isAuthenticated);
  useAppCommunicationSettings(isAuthenticated);

  const commsSettings = useSettingsStore((s) => s.commsSettings);

  useEffect(() => {
    if (!newCommunicationService && !isEmpty(commsSettings)) {
      const c = getClient({
        baseURL: commsSettings['URL'],
      });
      c.setAppId(commsSettings['APP_ID']);
      setNewCommunicationService(c);
    }
  }, [
    commsSettings,
    setNewCommunicationService,
    newCommunicationService,
    getClient,
  ]);

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

  useEffect(() => {
    if (!commsQueryClient) {
      // ts-ignore
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

  const isAppReady = useMemo(() => {
    return (
      rumsanService &&
      queryClient &&
      communicationService &&
      commsQueryClient &&
      chainSettings.id &&
      newCommsQueryClient &&
      newCommunicationService
    );
  }, [
    rumsanService,
    queryClient,
    communicationService,
    commsQueryClient,
    chainSettings.id,
    newCommsQueryClient,
    newCommunicationService,
  ]);

  if (!isAppReady) {
    console.log('App Settings is being loaded. Please Wait.', isAppReady);
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
  }

  return children;
}

export const useRumsanService = () => {
  return useContext(ServiceContext);
};
