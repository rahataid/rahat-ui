'use client';
import { useCambodiaSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import {
  CambodiaBeneficiaryTransactions,
  CambodiaVendorTransactions,
  CambodiaProjectTransactions,
  VillageDoctorVendorTransactions,
} from './graph.query';
import { useEffect } from 'react';
import { useCambodiaProjectSubgraphStore } from './stores/cambodia-project.store';
import { formatTransaction } from '../utils';

function normalizeEvmAddressForSubgraph(addr: string | undefined): string {
  const t = addr?.trim();
  if (!t) return '';
  return /^0x[a-fA-F0-9]{40}$/i.test(t) ? t.toLowerCase() : t;
}

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
        const { data, error } = await subgraphClient.query(
          CambodiaProjectTransactions,
          {},
        );
        if (error) {
          throw new Error(
            error.message ||
              'Could not reach the blockchain subgraph (GraphQL).',
          );
        }
        if (!data) {
          throw new Error('Subgraph returned no data.');
        }
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
        const { data, error } = await subgraphClient.query(
          CambodiaBeneficiaryTransactions,
          {
            beneficiaryAddress,
          },
        );
        if (error) {
          throw new Error(
            error.message ||
              'Could not reach the blockchain subgraph (GraphQL).',
          );
        }
        if (!data) throw new Error('Subgraph returned no data.');
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
  const vendor = normalizeEvmAddressForSubgraph(vendorAddress);

  const query = useQuery(
    {
      queryKey: ['CambodiaVendorTxn', vendor],
      enabled: Boolean(vendor),
      queryFn: async () => {
        const { data, error } = await subgraphClient.query(
          CambodiaVendorTransactions,
          {
            vendor,
          },
        );
        if (error) {
          throw new Error(
            error.message ||
              'Could not reach the blockchain subgraph (GraphQL).',
          );
        }
        if (!data) throw new Error('Subgraph returned no data.');
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

export const useVillageDoctorVendorTransactions = (vendorAddress: string) => {
  const { subgraphClient } = useCambodiaSubgraph();
  const { queryClient } = useRSQuery();
  const vendor = normalizeEvmAddressForSubgraph(vendorAddress);

  const query = useQuery(
    {
      queryKey: ['VillageDoctorVendorTxn', vendor],
      enabled: Boolean(vendor),
      queryFn: async () => {
        const { data, error } = await subgraphClient.query(
          VillageDoctorVendorTransactions,
          { vendor },
        );
        if (error) {
          throw new Error(
            error.message ||
              'Could not reach the blockchain subgraph (GraphQL).',
          );
        }
        if (!data) throw new Error('Subgraph returned no data.');

        const standardTypes = [
          'claimCreateds',
          'claimProcesseds',
          'tokensAllocateds',
          'otpVerifieds',
          'offlineClaimProcesseds',
        ];

        const formatted = standardTypes.reduce((acc: any[], type) => {
          const transactions = data[type] || [];
          return acc.concat(transactions.map(formatTransaction));
        }, []);

        const claimDetailsFormatted = (data['claimDetails'] || []).map(
          (t: any) => formatTransaction({ ...t, eventType: 'Claim Detail' }),
        );

        return [...formatted, ...claimDetailsFormatted];
      },
    },
    queryClient,
  );

  return query;
};
