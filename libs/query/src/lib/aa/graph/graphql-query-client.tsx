'use client';
import { cacheExchange, Client, fetchExchange, Provider } from 'urql';
import React from 'react';
import { useProjectSettingsStore } from '../../projects';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const GarphQlProvider = ({ children }: any) => {
  const backupSubgraphURL =
    (process.env['NEXT_PUBLIC_AA_SUBGRAPH_URL'] as string) || '';

  const { id: uuid } = useParams();

  const subgraphURL =
    useProjectSettingsStore(
      (s) => s.settings?.[uuid as UUID]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
    ) || '';

  const client = new Client({
    url: subgraphURL || backupSubgraphURL,
    exchanges: [cacheExchange, fetchExchange],
  });

  return <Provider value={client}>{children}</Provider>;
};

export default GarphQlProvider;
