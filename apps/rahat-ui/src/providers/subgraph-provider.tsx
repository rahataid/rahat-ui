'use client';

import { useSettingsStore } from '@rahat-ui/query';
import { GraphQuery } from '@rahataid/el-subgraph';
import { createContext, useContext } from 'react';

export type GraphContextType = {
  queryService: GraphQuery;
};

export const GraphContext = createContext<GraphContextType | null>(null);

interface QueryProviderProps {
  children: React.ReactNode;
}

export function GraphQueryProvider({ children }: QueryProviderProps) {
  const subgraphURL = useSettingsStore((s) => s.subGraphUrl);
  const queryService = new GraphQuery(subgraphURL);

  console.log("subgraph URL's", subgraphURL)

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
