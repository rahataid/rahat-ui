// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  TokenReceived,
  Transaction,
  TransactionsObject,
  MergeTransactions,
} from '../types';

export const mergeTransactions = async (
  transactionsObj: TransactionsObject,
) => {
  console.log({ transactionsObj });
  const { tokenReceiveds, transferProcesseds } = transactionsObj;

  // Combine the arrays
  const mergedTransactions: MergeTransactions[] = [
    ...tokenReceiveds.map((transaction) => ({
      ...transaction,
      topic: 'Received',
      date: new Date(
        parseInt(transaction.blockTimestamp) * 1000,
      ).toLocaleDateString('en-US', {
        timeZone: 'UTC',
      }),
    })),
    ...transferProcesseds.map((transaction) => ({
      ...transaction,
      to: transaction._beneficiary,
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
