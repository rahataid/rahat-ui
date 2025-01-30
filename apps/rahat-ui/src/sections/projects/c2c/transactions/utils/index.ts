// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  Transfers,
  Transaction,
  TransactionsObject,
  MergeTransactions,
} from '../types';

export const mergeTransactions = async (
  transactionsObj: TransactionsObject,
  contractAddress: string,
) => {
  console.log({ transactionsObj });
  const { transfers, transferProcesseds } = transactionsObj;

  const mergedTransactions: MergeTransactions[] = [
    // Combine the arrays
    ...transfers.map((transaction) => ({
      ...transaction,
      topic: 'Received',
      date: new Date(
        parseInt(transaction.blockTimestamp) * 1000,
      ).toLocaleDateString('en-US', {
        timeZone: 'UTC',
      }),
      amount: transaction.value,
      to: contractAddress,
    })),
    ...transferProcesseds.map((transaction) => ({
      ...transaction,
      to: transaction._to,
      amount: transaction._amount,
      token: transaction._tokenAddress,
      topic: 'Disbursed',
      date: new Date(
        parseInt(transaction.blockTimestamp) * 1000,
      ).toLocaleDateString('en-US', {
        timeZone: 'UTC',
      }),
    })),
  ];

  // Optionally, sort by timestamp if needed
  mergedTransactions.sort(
    (a, b) =>
      new Date(a.blockTimestamp).getTime() -
      new Date(b.blockTimestamp).getTime(),
  );
  const cleanedTransactions = mergedTransactions.map(
    ({ blockTimestamp, __typename, ...rest }) => rest,
  );

  return cleanedTransactions;
};
