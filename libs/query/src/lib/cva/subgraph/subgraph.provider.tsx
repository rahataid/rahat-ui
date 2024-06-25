'use client';
import { Client } from '@urql/core';
import React, { FC, createContext, useContext } from 'react';
import { GraphQuery } from './subgraph.query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useProjectSettingsStore } from '../../projects';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';

export type CVASubgraphContextType = {
  queryService: GraphQuery | null;
};

const CVASubgraphContext = createContext<CVASubgraphContextType | null>({
  queryService: null,
});

type CVASubgraphProviderProps = {
  children: React.ReactNode;
};

export function CVASubgraphProvider({ children }: CVASubgraphProviderProps) {
  const uuid = useParams()['id'] as UUID;

  const subGraphSettings = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
  );

  return (
    <CVASubgraphContext.Provider
      value={{
        queryService: new GraphQuery(
          subGraphSettings || 'http://localhost:8000',
        ),
      }}
    >
      {children}
    </CVASubgraphContext.Provider>
  );
}

export const useCVASubgraph = (): CVASubgraphContextType => {
  const context = useContext(CVASubgraphContext) as CVASubgraphContextType;
  if (context === undefined) {
    throw new Error('useCVASubgraph must be used within a CVASubgraphProvider');
  }
  return context;
};
