export const transformTransactionData = (data: any) => {
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
      Amount: item._amount,
      To: item._to,
      'Token Address': item._tokenAddress,
    };
  });
};
