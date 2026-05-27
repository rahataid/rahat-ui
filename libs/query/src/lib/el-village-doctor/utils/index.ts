export const formatTransaction = (trans: any) => ({
  beneficiary:
    trans.beneficiary ||
    trans.claimee ||
    trans.referrerBeneficiaries ||
    '-',
  vendor: trans.vendor || trans.claimer || '',
  processedBy:
    trans.beneficiary ||
    trans.claimee ||
    trans.vendor ||
    trans.claimer ||
    trans.beneficiaryAddress,
  topic: trans.eventType,
  timeStamp: new Date(
    parseInt(String(trans.blockTimestamp), 10) * 1000,
  ).toISOString(),
  txHash: trans.transactionHash,
  amount: trans?.amount || '',
  voucherId: trans.tokenAddress || trans.token || '-',
  id: trans.transactionHash,
});

export const mapTransactions = (transactions: any[]) =>
  transactions.map(formatTransaction);

export function sortTransactionsByTimestamp<
  T extends { timeStamp?: string | Date },
>(transactions: T[], direction: 'desc' | 'asc' = 'desc'): T[] {
  return [...transactions].sort((a, b) => {
    const aTime = new Date(a.timeStamp ?? 0).getTime();
    const bTime = new Date(b.timeStamp ?? 0).getTime();
    return direction === 'desc' ? bTime - aTime : aTime - bTime;
  });
}
