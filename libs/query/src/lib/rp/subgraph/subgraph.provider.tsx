'use client';
import { Client } from '@urql/core';
import React, { FC, createContext, useContext } from 'react';

export type RPSubgraphContextType = {
  subgraphClient: Client;
};

const RPSubgraphContext = createContext({
  subgraphClient: {} as Client,
});

type RPSubgraphProviderProps = {
  children: React.ReactNode;
  subgraphClient: Client;
};

export const RPSubgraphProvider: FC<RPSubgraphProviderProps> = ({
  children,
  subgraphClient,
}) => {
  return (
    <RPSubgraphContext.Provider
      value={{
        subgraphClient: subgraphClient as Client,
      }}
    >
      {children}
    </RPSubgraphContext.Provider>
  );
};

export const useRPSubgraph = (): RPSubgraphContextType => {
  const context = useContext(RPSubgraphContext);
  if (context === undefined) {
    throw new Error('useRPSubgraph must be used within a RPSubgraphProvider');
  }
  return context;
};
