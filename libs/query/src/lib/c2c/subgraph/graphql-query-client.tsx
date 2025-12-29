'use client';
import { cacheExchange, Client, fetchExchange, Provider, gql } from 'urql';
import {authExchange} from '@urql/exchange-auth';
import React from 'react';
import { useProjectSettingsStore } from '../../projects';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const GarphQlProvider = ({ children }: any) => {
 

  const { id: uuid } = useParams();
  const backupSubgraphURL =
    (process.env['NEXT_PUBLIC_SUBGRAPH_URL'] as string) || '';

  const subgraphURL =
    useProjectSettingsStore(
      (s) => s.settings?.[uuid as UUID]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
    ) || '';

  const token = useProjectSettingsStore(
    (s) => s.settings?.[uuid as UUID]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]
      ?.apikey,
  );
  
  const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshCredentials($refreshToken: String!) {
    refreshCredentials(refreshToken: $refreshToken) {
      refreshToken
      token
    }
  }
`;
  


  const auth = authExchange(async utilities =>{
    return {
      addAuthToOperation(operation){
        return token ? utilities.appendHeaders(operation, {
          Authorization: `Bearer ${token}`,
        }) : operation;
      },
      didAuthError(error) {
        return error.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED');
      },
      async refreshAuth() {
        const result = await utilities.mutate(REFRESH_TOKEN_MUTATION, {token});

      }
    }
  })
  let client: Client;
  if(token){
    client = new Client({
    url: subgraphURL || backupSubgraphURL,
    exchanges: [cacheExchange, auth, fetchExchange],
    
  });

  } else
   client = new Client({
    url: subgraphURL || backupSubgraphURL,
    exchanges: [cacheExchange, fetchExchange],
    
  });

  return <Provider value={client}>{children}</Provider>;
};

export default GarphQlProvider;
