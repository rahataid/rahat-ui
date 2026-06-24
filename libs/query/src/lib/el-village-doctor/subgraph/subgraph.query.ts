'use client';
import { useCambodiaSubgraph } from './subgraph.provider';
import { useQuery } from '@tanstack/react-query';
import { useRSQuery } from '@rumsan/react-query';
import {
  CambodiaBeneficiaryTransactions,
  CambodiaVendorTransactions,
  CambodiaProjectTransactions,
  VillageDoctorVendorTransactions,
  VillageDoctorVendorTokensAllocatedForBeneficiaries,
  VillageDoctorRedeemedBeneficiaries,
} from './graph.query';
import { useEffect } from 'react';
import { useCambodiaProjectSubgraphStore } from './stores/cambodia-project.store';
import { formatTransaction, sortTransactionsByTimestamp } from '../utils';

function normalizeEvmAddressForSubgraph(addr: string | undefined): string {
  const raw = typeof addr === 'string' ? addr : String(addr ?? '');
  const t = raw.trim();
  if (!t || t === 'undefined' || t === 'null') return '';
  const lower = t.toLowerCase();
  if (/^0x[a-f0-9]{40}$/.test(lower)) return lower;
  if (/^[a-f0-9]{40}$/.test(lower)) return `0x${lower}`;
  return lower;
}

function isCanonicalSubgraphVendorAddress(v: string): boolean {
  return /^0x[a-f0-9]{40}$/.test(v);
}

function collectVendorRelatedBeneficiaryAddresses(
  payload: Record<string, unknown>,
): string[] {
  const seen = new Set<string>();
  const add = (a: unknown) => {
    const n = normalizeEvmAddressForSubgraph(
      typeof a === 'string' ? a : String(a ?? ''),
    );
    if (n && isCanonicalSubgraphVendorAddress(n)) seen.add(n);
  };
  for (const c of (payload['claimCreateds'] as { claimee?: string }[]) ?? [])
    add(c?.claimee);
  for (const c of (payload['claimProcesseds'] as { beneficiary?: string }[]) ??
    [])
    add(c?.beneficiary);
  for (const c of (payload['claimDetails'] as { beneficiary?: string }[]) ?? [])
    add(c?.beneficiary);
  for (const c of (payload['offlineClaimProcesseds'] as {
    beneficiary?: string;
  }[]) ?? [])
    add(c?.beneficiary);
  for (const c of (payload['otpVerifieds'] as { beneficiary?: string }[]) ?? [])
    add(c?.beneficiary);
  return [...seen];
}

function mergeSubgraphRowsById<T extends { id?: string }>(
  existing: T[],
  extra: T[],
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of [...existing, ...extra]) {
    const id = row?.id != null ? String(row.id) : '';
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(row);
  }
  return out;
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
        return sortTransactionsByTimestamp(newData);
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
        return sortTransactionsByTimestamp(newData);
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

        return sortTransactionsByTimestamp(formattedData);
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
  const enabled = isCanonicalSubgraphVendorAddress(vendor);
  return useQuery(
    {
      queryKey: ['VillageDoctorVendorTxn', vendor],
      enabled,
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
        const payloadRaw = data ?? {};
        const beneficiaryAddrs =
          collectVendorRelatedBeneficiaryAddresses(payloadRaw);
        let mergedTokensAllocated = [
          ...((payloadRaw.tokensAllocateds as object[]) || []),
        ];
        if (beneficiaryAddrs.length > 0) {
          const CHUNK = 200;
          for (let i = 0; i < beneficiaryAddrs.length; i += CHUNK) {
            const chunk = beneficiaryAddrs.slice(i, i + CHUNK);
            const { data: allocData, error: allocErr } =
              await subgraphClient.query(
                VillageDoctorVendorTokensAllocatedForBeneficiaries,
                { beneficiaries: chunk },
              );
            if (allocErr) {
              console.warn(
                '[subgraph] VendorTokensAllocatedForBeneficiaries:',
                allocErr,
              );
            }
            mergedTokensAllocated = mergeSubgraphRowsById(
              mergedTokensAllocated,
              (allocData?.tokensAllocateds as { id?: string }[]) || [],
            );
          }
        }

        const payload = {
          ...payloadRaw,
          tokensAllocateds: mergedTokensAllocated,
        };

        const standardTypes = [
          'claimCreateds',
          'claimProcesseds',
          'tokensAllocateds',
          'otpVerifieds',
          'offlineClaimProcesseds',
        ];

        const formatted = standardTypes.reduce((acc: any[], type) => {
          const transactions = payload[type] || [];
          return acc.concat(transactions.map(formatTransaction));
        }, []);

        const claimDetailsFormatted = (payload['claimDetails'] || []).map(
          (t: any) => formatTransaction({ ...t, eventType: 'Claim Detail' }),
        );

        return sortTransactionsByTimestamp([
          ...formatted,
          ...claimDetailsFormatted,
        ]);
      },
    },
    queryClient,
  );
};

export const useVillageDoctorRedeemedBeneficiaries = () => {
  const { subgraphClient } = useCambodiaSubgraph();
  const { queryClient } = useRSQuery();

  return useQuery(
    {
      queryKey: ['VillageDoctorRedeemedBeneficiaries'],
      queryFn: async () => {
        const { data, error } = await subgraphClient.query(
          VillageDoctorRedeemedBeneficiaries,
          {},
        );
        if (error) {
          throw new Error(
            error.message ||
              'Could not reach the blockchain subgraph (GraphQL).',
          );
        }
        const addresses = new Set<string>();
        const addBeneficiary = (addr: unknown) => {
          const normalized = normalizeEvmAddressForSubgraph(
            typeof addr === 'string' ? addr : String(addr ?? ''),
          );
          if (normalized && isCanonicalSubgraphVendorAddress(normalized)) {
            addresses.add(normalized);
          }
        };
        for (const item of (data?.claimProcesseds as {
          beneficiary?: string;
        }[]) ?? []) {
          addBeneficiary(item.beneficiary);
        }
        for (const item of (data?.offlineClaimProcesseds as {
          beneficiary?: string;
        }[]) ?? []) {
          addBeneficiary(item.beneficiary);
        }
        for (const item of (data?.claimDetails as { beneficiary?: string }[]) ??
          []) {
          addBeneficiary(item.beneficiary);
        }
        for (const item of (data?.otpVerifieds as { beneficiary?: string }[]) ??
          []) {
          addBeneficiary(item.beneficiary);
        }
        return addresses;
      },
    },
    queryClient,
  );
};
