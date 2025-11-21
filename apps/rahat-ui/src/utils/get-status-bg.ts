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
  const normalizedStatus = status.toUpperCase().replace(/ /g, '_');
  if (normalizedStatus === 'NOT_STARTED') {
    return 'bg-gray-200';
  }

  if (normalizedStatus === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (normalizedStatus === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (normalizedStatus === 'DELAYED') {
    return 'bg-gray-200';
  }

  return 'bg-red-200';
};

export const isCompleteBgStatus = (status: string) => {
  if (status === 'COMPLETED') {
    return 'text-green-500 bg-green-100';
  }
  if (status === 'FAILED') {
    return 'text-red-500 bg-red-100';
  }
  if (status === 'PENDING') {
    return 'text-yellow-500 bg-yellow-100';
  }
  return 'text-blue-500 bg-gray-100';
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

export const getBadgeColor = (status: string | undefined) => {
  if (!status) return;

  if (['SUCCESSFUL'].includes(status)) {
    return 'text-green-600 border-green-500';
  }
  if (['CANCLELLED'].includes(status)) {
    return 'text-yellow-600 border-yellow-500';
  }
  return 'text-red-600 border-red-600';
};
