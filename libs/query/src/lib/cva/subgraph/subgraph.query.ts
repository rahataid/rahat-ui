import { useC2CSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { ProjectDetails } from './graph.query';
import { useEffect } from 'react';
import { useC2CProjectSubgraphStore } from './stores/c2c-project.store';

export const useProjectDetails = (projectAddress: string) => {
  const { subgraphClient } = useC2CSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useC2CProjectSubgraphStore(
    (state) => state.setProjectDetails
  );

  const query = useQuery(
    {
      queryKey: ['ProjectDetails', projectAddress],
      queryFn: async () => {
        console.log(`here`);
        const { data } = await subgraphClient.query(ProjectDetails, {
          projectAddress,
        });
        return data;
      },
    },
    queryClient
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectDetails(query.data);
    }
  }, [query, projectAddress, queryClient]);

  return query;
};
