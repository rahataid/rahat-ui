import { formatEther } from 'viem';

export const mergeTransactions = async (transactionsObj: any) => {
  console.log({ transactionsObj });
  const { tokenReceiveds, transferProcesseds } = transactionsObj;

  // Combine the arrays
  const mergedTransactions: any = [
    ...tokenReceiveds.map((transaction: any) => ({
      ...transaction,
      topic: 'Received',
      date: new Date(
        parseInt(transaction.blockTimestamp) * 1000,
      ).toLocaleDateString('en-US', {
        timeZone: 'UTC',
      }),
    })),
    ...transferProcesseds.map((transaction: any) => ({
      ...transaction,
      to: transaction._beneficiary,
      amount: formatEther(transaction._amount),
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
    (a: any, b: any) =>
      new Date(a.blockTimestamp).getTime() -
      new Date(b.blockTimestamp).getTime(),
  );
  const cleanedTransactions = mergedTransactions.map(
    ({ blockTimestamp, __typename, ...rest }: any) => rest,
  );

  return cleanedTransactions;
};
