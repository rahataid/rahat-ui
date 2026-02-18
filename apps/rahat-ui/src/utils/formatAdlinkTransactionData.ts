import { amountFormat } from '@rahat-ui/query';
import { formatUnits } from 'viem';

export const transformTransactionData = (data: any, tokenNumber: number) => {
  return data.map((item: any) => {
    // Convert unix timestamp to date
    const date = new Date(parseInt(item.blockTimestamp) * 1000);
    const formattedDate =
      date.getFullYear() +
      '/' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '/' +
      String(date.getDate()).padStart(2, '0');

    return {
      'Block Number': item.blockNumber,
      Date: formattedDate,
      ID: item.id,
      'Transaction Hash': item.transactionHash,
      'Amount (USDC)': amountFormat(formatUnits(item._amount, tokenNumber)),
      To: item._to,
      'Token Address': item._tokenAddress,
    };
  });
};
