import {
  Transfers,
  Transaction,
  TransactionsObject,
  MergeTransactions,
} from '../types';

export const mergeTransactions = async (
  transactionsObj: TransactionsObject,
  contractAddress: string,
  tokenDetails: any,
) => {
  console.log({ transactionsObj });
  const { transfers, transferProcesseds } = transactionsObj;

  const mergedTransactions: MergeTransactions[] = [
    // Combine the arrays
    ...transfers.map((transaction) => {
      const amount =
        (Number(transaction.value) as number) / 10 ** (tokenDetails.data ?? 18);

      // Format the amount in USD without the currency symbol
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Use 'decimal' to remove currency symbol
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return {
        ...transaction,
        topic: 'Received',
        date: new Date(
          parseInt(transaction.blockTimestamp) * 1000,
        ).toLocaleString('en-US', {
          timeZone: 'UTC',
        }),
        amount: formatted,
        to: contractAddress,
      };
    }),
    ...transferProcesseds.map((transaction) => {
      const amount =
        (Number(transaction._amount) as number) /
        10 ** (tokenDetails.data ?? 18);

      // Format the amount in USD without the currency symbol
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Use 'decimal' to remove currency symbol
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return {
        ...transaction,
        from: transaction._from,
        to: transaction._to,
        amount: formatted,
        token: transaction._tokenAddress,
        topic: 'Disbursed',
        date: new Date(
          parseInt(transaction.blockTimestamp) * 1000,
        ).toLocaleString('en-US', {
          timeZone: 'UTC',
        }),
      };
    }),
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
