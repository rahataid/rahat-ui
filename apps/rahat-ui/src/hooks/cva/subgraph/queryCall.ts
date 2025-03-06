// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
'use client';
import { useCVASubgraph } from '@rahat-ui/query';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'apps/rahat-ui/src/utils';
import { timeStamp } from 'console';

const formatTransaction = (transactions: any) => ({
  beneficiary: transactions.to,
  topic: transactions.__typename,
  timeStamp: formatDate(transactions.blockTimestamp),
  transactionHash: transactions.transactionHash,
  amount: transactions.value,
  blockNumber: transactions.blockNumber,
});

const mapTransactions = (transactions: any[]) => {
  transactions.map(formatTransaction);
};

export const useTransactionList = () => {
  const { queryService } = useCVASubgraph();
  return useQuery({
    queryKey: ['transactionList'],
    queryFn: async () => {
      const res = await queryService?.useTransactionList();
      console.log({ res });
      const transactionsArray = Object.keys(res)
        .filter((key) => key !== 'error')
        .map((key) => res[key]);
      console.log({ transactionsArray });
      return transactionsArray;
    },
  });
};

export const useClaimAssigneds = (beneficiary: string) => {
  const { queryService } = useCVASubgraph();
  return useQuery({
    queryKey: ['claimAssigneds'],
    queryFn: async () => {
      const res = await queryService?.useClaimAssigneds(beneficiary);
      const transactionsArray = Object.keys(res)
        .filter((key) => key !== 'error')
        .map((key) => res[key]);
      return transactionsArray;
    },
  });
};
