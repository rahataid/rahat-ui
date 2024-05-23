import { useCVASubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { ProjectDetails } from './graph.query';
import { useEffect } from 'react';
import { useCVAProjectSubgraphStore } from './stores/cva-project.store';

export const useCVAProjectDetails = (projectAddress: string) => {
  const { subgraphClient } = useCVASubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useCVAProjectSubgraphStore(
    (state) => state.setProjectDetails,
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
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectDetails(query.data);
    }
  }, [query, projectAddress, queryClient]);

  return query;
};
