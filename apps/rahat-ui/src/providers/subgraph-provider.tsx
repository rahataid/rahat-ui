'use client';

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
  const queryService = new GraphQuery(
    // 'https://api.studio.thegraph.com/query/42205/el-dev/version/latest',
    'https://api.thegraph.com/subgraphs/name/anupamakoirala-rumsan/el-dev',

    //'https://api.thegraph.com/subgraphs/name/anupamakoirala-rumsan/el',
  );

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
