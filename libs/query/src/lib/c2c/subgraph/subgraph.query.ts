'use client';
import { useC2CSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import { ProjectDetails, TransactionDetails } from './graph.query';
import { useEffect } from 'react';
import { useC2CProjectSubgraphStore } from './stores/c2c-project.store';

export const useProjectDetails = (projectAddress: string) => {
  const { subgraphClient } = useC2CSubgraph();
  console.log({ subgraphClient });
  const { queryClient } = useRSQuery();
  const setProjectDetails = useC2CProjectSubgraphStore(
    (state) => state.setProjectDetails,
  );

  console.log({ projectAddress, ProjectDetails });

  const query = useQuery(
    {
      queryKey: ['ProjectDetails', projectAddress],
      queryFn: async () => {
        const { data } = await subgraphClient
          .query(ProjectDetails, {
            projectAddress,
          })
          .toPromise();
        return data;
      },
    },
    queryClient,
  );

  console.log(query.data);

  useEffect(() => {
    if (query.isSuccess) {
      console.log(query.data);
      setProjectDetails(query.data);
    }
  }, [query, projectAddress, queryClient]);

  return query;
};

export const useTransactionDetails = () => {
  const { subgraphClient } = useC2CSubgraph();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: ['TransactionDetails'],
      queryFn: async () => {
        const { data } = await subgraphClient
          .query(TransactionDetails, {})
          .toPromise();
        return data;
      },
    },
    queryClient,
  );
  console.log(query.error);
  console.log({ query });
  console.log(query.data);

  return query;
};
