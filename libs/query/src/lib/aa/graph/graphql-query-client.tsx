'use client';
import { cacheExchange, Client, fetchExchange, Provider } from 'urql';
import React from 'react';

const GarphQlProvider = ({ children }: any) => {
  const QueryURL = process.env['NEXT_PUBLIC_AA_SUBGRAPH_URL'] as string;
  const client = new Client({
    url: QueryURL,
    exchanges: [cacheExchange, fetchExchange],
  });
  return <Provider value={client}>{children}</Provider>;
};

export default GarphQlProvider;
