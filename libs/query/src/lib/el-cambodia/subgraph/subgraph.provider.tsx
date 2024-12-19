'use client';
import { Client } from '@urql/core';
import React, { FC, createContext, useContext } from 'react';

export type CambodiaSubgraphContextType = {
  subgraphClient: Client;
};

const CambodiaSubgraphContext = createContext({
  subgraphClient: {} as Client,
});

type CambodiaSubgraphProvideCambodiarops = {
  children: React.ReactNode;
  subgraphClient: Client;
};

export const CambodiaSubgraphProvider: FC<
  CambodiaSubgraphProvideCambodiarops
> = ({ children, subgraphClient }) => {
  return (
    <CambodiaSubgraphContext.Provider
      value={{
        subgraphClient: subgraphClient as Client,
      }}
    >
      {children}
    </CambodiaSubgraphContext.Provider>
  );
};

export const useCambodiaSubgraph = (): CambodiaSubgraphContextType => {
  const context = useContext(CambodiaSubgraphContext);
  if (context === undefined) {
    throw new Error(
      'useCambodiaSubgraph must be used within a CambodiaSubgraphProvider',
    );
  }
  return context;
};
