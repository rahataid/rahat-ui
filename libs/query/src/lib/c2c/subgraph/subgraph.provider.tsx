'use client';
import { Client, Provider } from 'urql';
import React, { FC } from 'react';

type C2CSubgraphProviderProps = {
  children: React.ReactNode;
  subgraphClient: Client;
};

export const C2CSubgraphProvider: FC<C2CSubgraphProviderProps> = ({
  children,
  subgraphClient,
}) => {
  return <Provider value={subgraphClient}>{children}</Provider>;
};
