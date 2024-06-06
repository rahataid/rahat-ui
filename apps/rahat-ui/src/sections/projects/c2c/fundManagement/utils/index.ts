import { Transaction, TransactionsObject } from '../types';

export const mergeTransactions = async (
  transactionsObj: TransactionsObject,
): Promise<Transaction[]> => {
  console.log({ transactionsObj });
  const { tokenReceiveds, transferProcesseds } = transactionsObj;

  // Combine the arrays
  const mergedTransactions: Transaction[] = [
    ...tokenReceiveds,
    ...transferProcesseds,
  ];

  // Optionally, sort by timestamp if needed
  mergedTransactions.sort(
    (a, b) =>
      new Date(a.blockTimestamp).getTime() -
      new Date(b.blockTimestamp).getTime(),
  );

  return mergedTransactions;
};
