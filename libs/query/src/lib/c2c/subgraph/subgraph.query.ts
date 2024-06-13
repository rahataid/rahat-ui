'use client';

import { useQuery } from 'urql';
import { ReceivedTransactionDetails } from './graph.query';
import { useEffect, useState } from 'react';
import { Transaction } from 'viem';

export const useProjectDetails = (projectAddress: string) => {
  // const { queryClient } = useRSQuery();
  // const setProjectDetails = useC2CProjectSubgraphStore(
  //   (state) => state.setProjectDetails,
  // );
  // const query = useQuery(
  //   {
  //     queryKey: ['ProjectDetails', projectAddress],
  //     queryFn: async () => {
  //       console.log(`here`);
  //       const { data } = await subgraphClient.query(ProjectDetails, {
  //         projectAddress,
  //       });
  //       return data;
  //     },
  //   },
  //   queryClient,
  // );
  // useEffect(() => {
  //   if (query.isSuccess) {
  //     setProjectDetails(query.data);
  //   }
  // }, [query, projectAddress, queryClient]);
  // return query;
};

export const useRecentTransactionsList = (contractAddress: string) => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  const [result, ...restInfo] = useQuery({
    query: ReceivedTransactionDetails,
    variables: {
      contractAddress,
    },
    pause: !contractAddress,
  });

  useEffect(() => {
    (async () => {
      result.data
        ? setTransactionList(
            result.data.transfers.sort(
              (a: any, b: any) => +a.blockTimestamp - +b.blockTimestamp,
            ),
          )
        : setTransactionList([]);
    })();
  }, [result.data]);

  return [transactionList as Transaction[], ...restInfo];
};
