'use client';
import { Client } from '@urql/core';
import React, { FC, createContext, useContext } from 'react';

export type KenyaSubgraphContextType = {
  subgraphClient: Client;
};

const KenyaSubgraphContext = createContext({
  subgraphClient: {} as Client,
});

type KenyaSubgraphProvideKenyarops = {
  children: React.ReactNode;
  subgraphClient: Client;
};

export const KenyaSubgraphProvider: FC<KenyaSubgraphProvideKenyarops> = ({
  children,
  subgraphClient,
}) => {
  return (
    <KenyaSubgraphContext.Provider
      value={{
        subgraphClient: subgraphClient as Client,
      }}
    >
      {children}
    </KenyaSubgraphContext.Provider>
  );
};

export const useKenyaSubgraph = (): KenyaSubgraphContextType => {
  const context = useContext(KenyaSubgraphContext);
  if (context === undefined) {
    throw new Error('useKenyaSubgraph must be used within a KenyaSubgraphProvider');
  }
  return context;
};
