'use client';

import { useQuery } from 'urql';
import {
  BeneficiaryTransaction,
  ReceivedTransactionDetails,
} from './graph.query';
import { useEffect, useState } from 'react';
import { Transaction } from 'viem';
import { mergeTransactions } from '../utils';
import { RumsanService } from '@rumsan/sdk';
import { useRSQuery } from '@rumsan/react-query';

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

  // track loading/error states for the REST request
  const [restLoading, setRestLoading] = useState(false);
  const [restError, setRestError] = useState<Error | null>(null);

  // from your custom hook or context
  const { rumsanService } = useRSQuery();

  // GQL query: fetch data if address is present
  const [result] = useQuery({
    query: BeneficiaryTransaction,
    variables: { beneficiary: beneficiaryAddress },
    pause: !beneficiaryAddress, // skip if empty
  });

  useEffect(() => {
    // If no address or no GQL data, reset
    if (!beneficiaryAddress || !result.data) {
      setTransactionList([]);
      return;
    }

    let isMounted = true; // to avoid setState if unmounted

    (async () => {
      try {
        // 1) Merge the GraphQL data
        const transactionLists = await mergeTransactions(result.data);

        // 2) REST request to fetch offramp transactions
        setRestLoading(true);
        setRestError(null);

        const offrampResponse = await rumsanService.client.get(
          '/offramps/transactions',
          {
            params: {
              senderAddress: beneficiaryAddress,
            },
          },
        );

        // 3) Format the REST response
        const formatted = offrampResponse?.data?.data?.map((tx: any) => ({
          ...tx,
          beneficiary: tx.senderAddress,
          topic: `Offramp (${tx.status})`,
          date: tx.createdAt
            ? new Date(
                typeof tx.createdAt === 'string'
                  ? tx.createdAt
                  : tx.createdAt?.toISOString(),
              ).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : '',
          transactionHash: tx.txHash,
          amount: tx.extras?.cryptoAmount,
        }));

        // 4) Combine both sets & update state (if still mounted)
        if (isMounted) {
          transactionLists.push(...formatted);
          setTransactionList(transactionLists);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Error fetching transactions:', err);
          setRestError(err);
          setTransactionList([]); // or keep existing if you prefer
        }
      } finally {
        if (isMounted) {
          setRestLoading(false);
        }
      }
    })();

    // Cleanup if component unmounts
    return () => {
      isMounted = false;
    };
  }, [beneficiaryAddress, result.data, rumsanService]);

  // Combine loading & errors from GraphQL + REST
  const isLoading = result.fetching || restLoading;
  const error = result.error || restError;

  return {
    data: transactionList,
    isLoading,
    error,
  };
};
