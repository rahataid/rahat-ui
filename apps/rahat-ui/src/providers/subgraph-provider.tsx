'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import { GraphQuery } from '@rahataid/el-subgraph';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

export type GraphContextType = {
  queryService: GraphQuery | null;
};

export const GraphContext = createContext<GraphContextType | null>({
  queryService: null,
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function GraphQueryProvider({ children }: QueryProviderProps) {
  const uuid = useParams().id as UUID;
  useProjectSubgraphSettings(uuid);

  const subgraphSettings = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
  );

  return (
    <GraphContext.Provider
      value={{
        queryService: new GraphQuery(
          subgraphSettings || 'http://localhost:8000',
        ),
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export const useGraphService = (): GraphContextType => {
  return useContext(GraphContext) as GraphContextType;
};
