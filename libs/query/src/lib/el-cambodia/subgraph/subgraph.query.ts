'use client';
import { useCambodiaSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import {
  CambodiaBeneficiaryTransactions,
  CambodiaVendorTransactions,
  CambodiaProjectTransactions,
} from './graph.query';
import { useEffect } from 'react';
import { useCambodiaProjectSubgraphStore } from './stores/cambodia-project.store';
import { formatTransaction } from '../utils';

export const useCambodiaProjectTransactions = () => {
  const { subgraphClient } = useCambodiaSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectTransactions = useCambodiaProjectSubgraphStore(
    (state) => state.setProjectTransactions,
  );

  const query = useQuery(
    {
      queryKey: ['CambodiaProjectTransactions'],
      queryFn: async () => {
        const { data } = await subgraphClient.query(
          CambodiaProjectTransactions,
          {},
        );
        const transactionsType = [
          'claimCreateds',
          'claimProcesseds',
          'tokensAllocateds',
          'offlineClaimProcesseds',
          'otpAddeds',
          'otpVerifieds',
        ];
        const newData = transactionsType.reduce((acc, type) => {
          const transactions = data[type] || [];
          return acc.concat(transactions.map(formatTransaction));
        }, []);
        return newData;
      },
    },
    queryClient,
  );

  useEffect(() => {
    if (query.isSuccess) {
      setProjectTransactions(query.data);
    }
  }, [query, queryClient]);

  return query;
};

export const useCambodiaBeneficiaryTransactions = (
  beneficiaryAddress: string,
) => {
  const { subgraphClient } = useCambodiaSubgraph();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: ['CambodiaBeneficiaryTxn', beneficiaryAddress],
      queryFn: async () => {
        const { data } = await subgraphClient.query(
          CambodiaBeneficiaryTransactions,
          {
            beneficiaryAddress,
          },
        );
        const transactionsType = [
          'tokensAllocateds',
          'claimCreateds',
          'otpAddeds',
          'claimProcesseds',
        ];
        const newData = transactionsType.reduce((acc, type) => {
          const transactions = data[type] || [];
          return acc.concat(transactions.map(formatTransaction));
        }, []);
        return newData;
      },
    },
    queryClient,
  );

  return query;
};

export const useCambodiaVendorTransactions = (vendorAddress: string) => {
  const { subgraphClient } = useCambodiaSubgraph();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: ['CambodiaVendorTxn', vendorAddress],
      queryFn: async () => {
        const { data } = await subgraphClient.query(
          CambodiaVendorTransactions,
          {
            vendor: vendorAddress,
          },
        );
        const transactionType = ['claimProcesseds', 'offlineClaimProcesseds'];

        const formattedData = transactionType.reduce((acc, type) => {
          const transactions = data[type] || [];
          return acc.concat(transactions.map(formatTransaction));
        }, []);

        return formattedData;
      },
    },
    queryClient,
  );

  return query;
};
