'use client';
import { useKenyaSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import {
  KenyaBeneficiaryTransactions,
  KenyaVendorTransactions,
  KenyaProjectTransactions,
  SmsVoucherProjectTransactions,
} from './graph.query';
import { useEffect } from 'react';
import { useKenyaProjectSubgraphStore } from './stores/kenya-project.store';
import { formatTransaction } from '../utils';

export const useKenyaProjectTransactions = (
  first: number,
  timeStamp: number,
) => {
  const { subgraphClient } = useKenyaSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectTransactions = useKenyaProjectSubgraphStore(
    (state) => state.setProjectTransactions,
  );

  const query = useQuery(
    {
      queryKey: ['ProjectTransactions', first, timeStamp],

      queryFn: async () => {
        const { data } = await subgraphClient.query(
          KenyaProjectTransactions(first, timeStamp),
          {},
        );
        const transactionsType = [
          'claimCreateds',
          'claimProcesseds',
          'tokensAllocateds',
          'offlineClaimProcesseds',
          'otpAddeds',
          'otpVerifieds',
          'walkInBeneficiaryAddeds',
        ];
        const newData: any = transactionsType.reduce((acc, type) => {
          const transactions = data[type] || [];
          return acc.concat(transactions.map(formatTransaction));
        }, []);
        newData.sort((a: any, b: any) => {
          return b.timeStamp - a.timeStamp;
        });
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

export const useSmsVoucherProjectTransactions = (
  first: number,
  timeStamp: number,
) => {
  const { subgraphClient } = useKenyaSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectTransactions = useKenyaProjectSubgraphStore(
    (state) => state.setProjectTransactions,
  );

  const query = useQuery(
    {
      queryKey: ['ProjectTransactions', first, timeStamp],
      queryFn: async () => {
        const { data } = await subgraphClient.query(
          SmsVoucherProjectTransactions(first, timeStamp),
          {},
        );
        const transactionsType = ['walkInBeneficiaryAddeds'];
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

export const useKenyaBeneficiaryTransactions = (beneficiaryAddress: string) => {
  const { subgraphClient } = useKenyaSubgraph();
  const { queryClient } = useRSQuery();
  const setProjectDetails = useKenyaProjectSubgraphStore(
    (state) => state.setProjectDetails,
  );

  const query = useQuery(
    {
      queryKey: ['beneficiaryTxn', beneficiaryAddress],
      queryFn: async () => {
        const { data } = await subgraphClient.query(
          KenyaBeneficiaryTransactions,
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

export const useKenyaVendorTransactions = (vendorAddress: string) => {
  const { subgraphClient } = useKenyaSubgraph();
  const { queryClient } = useRSQuery();

  const query = useQuery(
    {
      queryKey: ['VendorTxn', vendorAddress],
      queryFn: async () => {
        const { data } = await subgraphClient.query(KenyaVendorTransactions, {
          vendor: vendorAddress.trim(),
        });
        const transactionType = [
          'claimCreateds',
          'claimProcesseds',
          'offlineClaimProcesseds',
          'walkInBeneficiaryAddeds',
        ];

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
