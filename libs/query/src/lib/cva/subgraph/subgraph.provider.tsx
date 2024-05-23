import { Client } from '@urql/core';
import React, { FC, createContext, useContext } from 'react';

export type CVASubgraphContextType = {
  subgraphClient: Client;
};

const CVASubgraphContext = createContext({
  subgraphClient: {} as Client,
});

type CVASubgraphProviderProps = {
  children: React.ReactNode;
  subgraphClient: Client;
};

const CVASubgraphProvider: FC<CVASubgraphProviderProps> = ({
  children,
  subgraphClient,
}) => {
  return (
    <CVASubgraphContext.Provider
      value={{
        subgraphClient: subgraphClient as Client,
      }}
    >
      {children}
    </CVASubgraphContext.Provider>
  );
};

export default CVASubgraphProvider;

export const useCVASubgraph = (): CVASubgraphContextType => {
  const context = useContext(CVASubgraphContext);
  if (context === undefined) {
    throw new Error('useCVASubgraph must be used within a CVASubgraphProvider');
  }
  return context;
};
