const STATUS_OPTIONS = {
  DEFAULT: ['ALL', 'PENDING', 'COMPLETED', 'FAILED'],

  FSP_MANUAL: [
    'ALL',
    'FIAT_TRANSACTION_INITIATED',
    'FIAT_TRANSACTION_COMPLETED',
    'FIAT_TRANSACTION_FAILED',
  ],

  FSP_AUTO: [
    'ALL',
    'PENDING',
    'TOKEN_TRANSACTION_INITIATED',
    'TOKEN_TRANSACTION_COMPLETED',
    'TOKEN_TRANSACTION_FAILED',
    'FIAT_TRANSACTION_INITIATED',
    'FIAT_TRANSACTION_COMPLETED',
    'FIAT_TRANSACTION_FAILED',
    'COMPLETED',
    'FAILED',
  ],
};

export const getPayoutTransactionStatusOptions = (
  payoutType: string,
  paymentProviderType?: string,
): readonly string[] => {
  if (payoutType === 'FSP') {
    if (paymentProviderType === 'manual_bank_transfer') {
      return STATUS_OPTIONS.FSP_MANUAL;
    }
    return STATUS_OPTIONS.FSP_AUTO;
  }

  return STATUS_OPTIONS.DEFAULT;
};
