import { Client } from '@urql/core';
import React, { FC, createContext, useContext } from 'react';

export type C2CSubgraphContextType = {
  subgraphClient: Client;
};

const C2CSubgraphContext = createContext({
  subgraphClient: {} as Client,
});

type C2CSubgraphProviderProps = {
  children: React.ReactNode;
  subgraphClient: Client;
};

const C2CSubgraphProvider: FC<C2CSubgraphProviderProps> = ({
  children,
  subgraphClient,
}) => {
  return (
    <C2CSubgraphContext.Provider
      value={{
        subgraphClient: subgraphClient as Client,
      }}
    >
      {children}
    </C2CSubgraphContext.Provider>
  );
};

export default C2CSubgraphProvider;

export const useC2CSubgraph = (): C2CSubgraphContextType => {
  const context = useContext(C2CSubgraphContext);
  if (context === undefined) {
    throw new Error('useC2CSubgraph must be used within a C2CSubgraphProvider');
  }
  return context;
};
