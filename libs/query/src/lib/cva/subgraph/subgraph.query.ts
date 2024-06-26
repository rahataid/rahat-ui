// 'use client';
// import { useCVASubgraph } from './subgraph.provider';
// import { useQuery } from '@tanstack/react-query';
// import { useRSQuery } from '@rumsan/react-query';
// import { ProjectDetails, TransactionLists } from './graph.query';
// import { useEffect } from 'react';
// import { useCVAProjectSubgraphStore } from './stores/cva-project.store';

// export const useCVAProjectDetails = (projectAddress: string) => {
//   const { subgraphClient } = useCVASubgraph();
//   const { queryClient } = useRSQuery();
//   const setProjectDetails = useCVAProjectSubgraphStore(
//     (state) => state.setProjectDetails,
//   );

//   const query = useQuery(
//     {
//       queryKey: ['ProjectDetails', projectAddress],
//       queryFn: async () => {
//         const { data } = await subgraphClient.query(ProjectDetails, {
//           projectAddress,
//         });
//         return data;
//       },
//     },
//     queryClient,
//   );

//   useEffect(() => {
//     if (query.isSuccess) {
//       setProjectDetails(query.data);
//     }
//   }, [query, projectAddress, queryClient]);

//   return query;
// };

// export const useCVATransactionLists = (projectAddress: string) => {
//   const { subgraphClient } = useCVASubgraph();
//   const { queryClient } = useRSQuery();

//   const query = useQuery(
//     {
//       queryKey: ['ProjectTransactions', projectAddress],
//       queryFn: async () => {
//         const { data } = await subgraphClient.query(TransactionLists, {});
//         return data;
//       },
//     },
//     queryClient,
//   );

//   return query;
// };

import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { ClaimAssigneds, TransactionLists } from './graph.query';

export class GraphQuery {
  private subGraphQuery: Client;
  constructor(graphUrl: string) {
    console.log({ graphUrl });
    this.subGraphQuery = new Client({
      url: graphUrl,
      exchanges: [cacheExchange, fetchExchange],
    });
  }

  async useTransactionList() {
    const { data, error } = await this.subGraphQuery.query(
      TransactionLists,
      {},
    );

    return { ...data.transfers, error };
  }

  async useClaimAssigneds(beneficiary: string) {
    const { data, error } = await this.subGraphQuery.query(ClaimAssigneds, {
      beneficiary,
    });

    return { ...data.claimAssigneds, error };
  }
}
