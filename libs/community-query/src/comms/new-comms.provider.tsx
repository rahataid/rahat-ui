'use client';

import { getClient } from '@rumsan/connect/src/clients/index';
import { QueryClient } from '@tanstack/react-query';
import React, { createContext, FC, useState } from 'react';

type NewCommsService = ReturnType<typeof getClient>;

export type CommunicationQueryContextType = {
  newQueryClient: QueryClient;
  newCommunicationService: NewCommsService;

  setNewQueryClient: (queryClient: QueryClient) => void;
  setNewCommunicationService: (newCommunicationService: any) => void;
};

const CommunicationQueryContext = createContext<CommunicationQueryContextType>(
  {} as CommunicationQueryContextType,
);

type CommunicationQueryProviderProps = {
  children: React.ReactNode;
};

export const NewCommunicationQueryProvider: FC<
  CommunicationQueryProviderProps
> = ({ children }) => {
  //todo: use client that is passed from the parent
  const [newQueryClient, setNewQueryClient] = useState<
    CommunicationQueryContextType['newQueryClient']
  >(new QueryClient());

  const [newCommunicationService, setNewCommunicationService] =
    useState<CommunicationQueryContextType['newCommunicationService']>();

  return (
    <CommunicationQueryContext.Provider
      value={
        {
          newQueryClient,
          newCommunicationService,
          setNewQueryClient,
          setNewCommunicationService,
        } as CommunicationQueryContextType
      }
    >
      {children}
    </CommunicationQueryContext.Provider>
  );
};

export const useNewCommunicationQuery = () => {
  const context = React.useContext(CommunicationQueryContext);
  console.log(context, 'context');
  if (context === undefined) {
    throw new Error(
      'useNewCommunicationQuery must be used within a CommunicationQueryProvider',
    );
  }
  return context;
};
