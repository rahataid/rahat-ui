'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
  useSettingsStore,
} from '@rahat-ui/query';
import { GraphQuery } from '@rahataid/el-subgraph';
import { UUID } from 'crypto';
import { isEmpty } from 'lodash';
import { useParams } from 'next/navigation';
import { createContext, useContext } from 'react';

export type GraphContextType = {
  queryService: GraphQuery;
};

export const GraphContext = createContext<GraphContextType | null>(null);

interface QueryProviderProps {
  children: React.ReactNode;
}

export function GraphQueryProvider({ children }: QueryProviderProps) {
  const uuid = useParams().id as UUID;
  useProjectSubgraphSettings(uuid);

  const subgraphSettings = useProjectSettingsStore(
    (s) => s.settings?.[uuid][PROJECT_SETTINGS_KEYS.SUBGRAPH] || null,
  );

  if (isEmpty(subgraphSettings)) return null;

  const queryService = new GraphQuery(subgraphSettings?.url);

  return (
    <GraphContext.Provider
      value={{
        queryService,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}
export const useGraphService = (): GraphContextType => {
  return useContext(GraphContext) as GraphContextType;
};
