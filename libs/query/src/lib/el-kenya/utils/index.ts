export const formatTransaction = (trans: any) => ({
  beneficiary:
    trans.beneficiary || trans.referrerBeneficiaries || trans.claimee || '-',
  vendor: trans.vendor || '',
  processedBy:
    trans.beneficiary ||
    trans.vendor ||
    trans.claimer ||
    trans.beneficiaryAddress,
  topic: trans.eventType,
  timeStamp: new Date(parseInt(trans.blockTimestamp) * 1000),
  txHash: trans.transactionHash,
  amount: trans?.amount || '',
  voucherId: trans.tokenAddress || trans.token || '-',
  id: trans.transactionHash,
});

export const mapTransactions = (transactions: any[]) =>
  transactions.map(formatTransaction);
