const STATUS_OPTIONS = {
  DEFAULT: [
    'ALL',
    'PENDING',
    'COMPLETED',
    'PARTIALLY_COMPLETED',
    'FAILED',
    'CANCELLED',
  ],

  FSP_MANUAL: [
    'ALL',
    'FIAT_TRANSACTION_INITIATED',
    'FIAT_TRANSACTION_COMPLETED',
    'FIAT_TRANSACTION_FAILED',
    'CANCELLED',
    'FAILED',
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
    'PARTIALLY_COMPLETED',
    'FAILED',
    'CANCELLED',
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
