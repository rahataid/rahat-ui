'use client';
import { useRPSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import {
  ProjectTransactions,
  VendorTransactions,
  BeneficiaryTransactions,
  TreasuryTokenTransactions,
} from './graph.query';
import { useEffect } from 'react';
import { useRPProjectSubgraphStore } from './stores/rp-project.store';
import { formatTransaction } from '../utils';

export const useRPProjectTransactions = () => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectTransactions = useRPProjectSubgraphStore(
    (state) => state.setProjectTransactions,
  );

  const query = useQuery(
    {
      queryKey: ['ProjectTransactions'],
      queryFn: async () => {
        const { data } = await subgraphClient.query(ProjectTransactions, {});
        const transactionsType = [
          'claimCreateds',
          'claimProcesseds',
          'tokensAllocateds',
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
      console.log(query);
      setProjectTransactions(query.data);
    }
  }, [query, queryClient]);

  return query;
};

export const useRPBeneficiaryTransactions = (beneficiaryAddress: string) => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useRPProjectSubgraphStore(
    (state) => state.setProjectDetails,
  );

  const query = useQuery(
    {
      queryKey: ['beneficiaryTxn', beneficiaryAddress],
      queryFn: async () => {
        const { data } = await subgraphClient.query(BeneficiaryTransactions, {
          beneficiaryAddress,
        });
        const transactionsType = ['tokensAllocateds', 'claimCreateds'];
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

export const useRPVendorTransactions = (vendorAddress: string) => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();
  

  const query = useQuery(
    {
      queryKey: ['VendorTxn', vendorAddress],
      queryFn: async () => {
        const { data } = await subgraphClient.query(VendorTransactions, {
          vendor: vendorAddress,
        });
        const transactionType = ['claimCreateds', 'claimProcesseds'];

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

export const useTreasuryTokenTransaction = () => {
  const { subgraphClient } = useRPSubgraph();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: ['TreasuryTokenTransaction'],
      queryFn: async () => {
        const { data } = await subgraphClient.query(
          TreasuryTokenTransactions,
          {},
        );
        console.log({ data });
        return data;
      },
    },
    queryClient,
  );

  return query;
};
