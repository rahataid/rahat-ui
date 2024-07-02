export const formatTransaction = (trans: any) => ({
    beneficiary: trans.beneficiary || trans.referrerBeneficiaries || '-',
    vendor: trans.vendor || '',
    processedBy:
      trans.beneficiary ||
      trans.vendor ||
      trans.claimer ||
      trans.beneficiaryAddress,
    topic: trans.eventType,
    date: new Date(
        parseInt(trans.blockTimestamp) * 1000,
      ).toLocaleDateString('en-US', {
        timeZone: 'UTC',
      }),
    transactionHash: trans.transactionHash,
    amount: '',
    voucherId: trans.tokenAddress || trans.token || '-',
    id: trans.transactionHash,
  });

 export  const mapTransactions = (transactions: any[]) =>
    transactions.map(formatTransaction);
  

