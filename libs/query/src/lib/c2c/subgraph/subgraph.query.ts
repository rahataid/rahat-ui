'use client';

import { useQuery } from 'urql';
import {
  BeneficiaryTransaction,
  ReceivedTransactionDetails,
} from './graph.query';
import { useEffect, useState } from 'react';
import { Transaction } from 'viem';
import { mergeTransactions } from '../utils';

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

  const [result] = useQuery({
    query: ReceivedTransactionDetails,
    variables: {
      contractAddress,
    },
    pause: !contractAddress,
  });

  useEffect(() => {
    (async () => {
      if (result.data) {
        setTransactionList(
          result.data.transfers.sort(
            (a: any, b: any) => +a.blockTimestamp - +b.blockTimestamp,
          ),
        );
      } else {
        setTransactionList([]);
      }
    })();
  }, [result.data]);

  return {
    data: transactionList,
    isLoading: result.fetching,
    error: result.error,
  };
};

export const useBeneficiaryTransaction = (beneficiaryAddress: string) => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  const [result] = useQuery({
    query: BeneficiaryTransaction,
    variables: {
      beneficiary: beneficiaryAddress,
    },
    pause: !beneficiaryAddress,
  });

  useEffect(() => {
    (async () => {
      if (result.data) {
        const transactionObject = result.data;
        const transactionLists = await mergeTransactions(transactionObject);
        setTransactionList(transactionLists);
      } else {
        setTransactionList([]);
      }
    })();
  }, [result.data]);

  return {
    data: transactionList,
    isLoading: result.fetching,
    error: result.error,
  };
};
