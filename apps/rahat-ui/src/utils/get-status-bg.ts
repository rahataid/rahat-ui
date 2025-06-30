export enum PayoutTransactionStatus {
  PENDING = 'PENDING',
  TOKEN_TRANSACTION_INITIATED = 'TOKEN_TRANSACTION_INITIATED',
  TOKEN_TRANSACTION_COMPLETED = 'TOKEN_TRANSACTION_COMPLETED',
  TOKEN_TRANSACTION_FAILED = 'TOKEN_TRANSACTION_FAILED',
  FIAT_TRANSACTION_INITIATED = 'FIAT_TRANSACTION_INITIATED',
  FIAT_TRANSACTION_COMPLETED = 'FIAT_TRANSACTION_COMPLETED',
  FIAT_TRANSACTION_FAILED = 'FIAT_TRANSACTION_FAILED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const PayoutTransactionFailedStatuses = [
  'TOKEN_TRANSACTION_FAILED',
  'FIAT_TRANSACTION_FAILED',
  'FAILED',
] as const;

export const getStatusBg = (status: string) => {
  if (status === 'NOT_STARTED') {
    return 'bg-red-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-gray-200';
  }

  return '';
};

export const isCompleteBgStatus = (isComplete: boolean) => {
  if (isComplete) {
    return 'text-green-500 bg-green-100';
  }
  return 'text-red-500 bg-red-100';
};

export const transactionBgStatus = (
  status: PayoutTransactionStatus,
): string => {
  switch (status) {
    case PayoutTransactionStatus.PENDING:
    case PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED:
    case PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED:
      return 'text-yellow-500 bg-yellow-100';

    case PayoutTransactionStatus.TOKEN_TRANSACTION_COMPLETED:
    case PayoutTransactionStatus.FIAT_TRANSACTION_COMPLETED:
    case PayoutTransactionStatus.COMPLETED:
      return 'text-green-500 bg-green-100';

    case PayoutTransactionStatus.TOKEN_TRANSACTION_FAILED:
    case PayoutTransactionStatus.FIAT_TRANSACTION_FAILED:
    case PayoutTransactionStatus.FAILED:
      return 'text-red-500 bg-red-100';

    default:
      return 'bg-gray-200'; // fallback for undefined statuses
  }
};

export const isPayoutTransactionFailed = (status?: string): boolean => {
  return !!status && PayoutTransactionFailedStatuses.includes(status as any);
};
