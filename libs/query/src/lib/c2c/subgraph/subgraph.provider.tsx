'use client';
import { Provider, Client, fetchExchange, cacheExchange } from 'urql';
import React, { FC, createContext, useContext } from 'react';

type C2CSubgraphProviderProps = {
  children: React.ReactNode;
};

export const C2CSubgraphProvider: FC<C2CSubgraphProviderProps> = ({
  children,
}) => {
  const subgraphClient = new Client({
    url: 'http://localhost:8000/subgraphs/name/rahat/c2c',
    exchanges: [cacheExchange, fetchExchange],
  });

  console.log('here', subgraphClient);

  return <Provider value={subgraphClient}>{children}</Provider>;
};
