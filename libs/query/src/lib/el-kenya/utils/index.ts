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

export function mapStatus(status: string) {
  const statusMapping: any = {
    CHECKED: 'Eye Checkup',
    PURCHASE_OF_GLASSES: 'Purchase of Glasses',
    READING_GLASSES: 'Reading Glasses',
    SUN_GLASSES: 'Sun Glasses',
    PRESCRIBED_LENSES: 'Prescribed Lenses',
    REDEEMED: 'Redeemed',
    NOT_REDEEMED: 'Not Redeemed',
    yes: 'Yes',
    no: 'No',
    skip: 'Skip',
    LENSES: 'Lenses',
    FRAMES: 'Frames',
  };
  return statusMapping[status] || '-';
}
