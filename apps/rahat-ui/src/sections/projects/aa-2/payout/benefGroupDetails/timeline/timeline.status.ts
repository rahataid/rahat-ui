import { PayoutTransactionStatus } from 'apps/rahat-ui/src/utils/get-status-bg';

export type StatusCategory = 'completed' | 'pending' | 'failed';

export type StatusMeta = {
  label: string;
  color: string;
  category: StatusCategory;
};

const STATUS_REGISTRY: Record<PayoutTransactionStatus, StatusMeta> = {
  [PayoutTransactionStatus.PENDING]: {
    label: 'Pending',
    color: '#F59E0B',
    category: 'pending',
  },
  [PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED]: {
    label: 'Token Initiated',
    color: '#8B5CF6',
    category: 'pending',
  },
  [PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED]: {
    label: 'Fiat Initiated',
    color: '#6366F1',
    category: 'pending',
  },

  [PayoutTransactionStatus.TOKEN_TRANSACTION_COMPLETED]: {
    label: 'Token Completed',
    color: '#10B981',
    category: 'completed',
  },
  [PayoutTransactionStatus.FIAT_TRANSACTION_COMPLETED]: {
    label: 'Fiat Completed',
    color: '#14B8A6',
    category: 'completed',
  },
  [PayoutTransactionStatus.COMPLETED]: {
    label: 'Completed',
    color: '#22C55E',
    category: 'completed',
  },
  [PayoutTransactionStatus.PARTIALLY_COMPLETED]: {
    label: 'Partially Completed',
    color: '#84CC16',
    category: 'completed',
  },

  [PayoutTransactionStatus.TOKEN_TRANSACTION_FAILED]: {
    label: 'Token Failed',
    color: '#EF4444',
    category: 'failed',
  },
  [PayoutTransactionStatus.FIAT_TRANSACTION_FAILED]: {
    label: 'Fiat Failed',
    color: '#F97316',
    category: 'failed',
  },
  [PayoutTransactionStatus.FAILED]: {
    label: 'Failed',
    color: '#DC2626',
    category: 'failed',
  },
  [PayoutTransactionStatus.CANCELLED]: {
    label: 'Cancelled',
    color: '#9CA3AF',
    category: 'failed',
  },
};

export const normalizeStatusKey = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

export const getStatusMeta = (value: unknown): StatusMeta | undefined => {
  const key = normalizeStatusKey(value) as PayoutTransactionStatus;
  return STATUS_REGISTRY[key];
};

export const CANONICAL_STATUS_ORDER: PayoutTransactionStatus[] = [
  PayoutTransactionStatus.COMPLETED,
  PayoutTransactionStatus.PARTIALLY_COMPLETED,
  PayoutTransactionStatus.TOKEN_TRANSACTION_COMPLETED,
  PayoutTransactionStatus.FIAT_TRANSACTION_COMPLETED,
  PayoutTransactionStatus.PENDING,
  PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED,
  PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED,
  PayoutTransactionStatus.FAILED,
  PayoutTransactionStatus.TOKEN_TRANSACTION_FAILED,
  PayoutTransactionStatus.FIAT_TRANSACTION_FAILED,
  PayoutTransactionStatus.CANCELLED,
];

export const sortStatusesCanonically = (statuses: string[]): string[] => {
  return [...statuses].sort((a, b) => {
    const idxA = CANONICAL_STATUS_ORDER.indexOf(a as PayoutTransactionStatus);
    const idxB = CANONICAL_STATUS_ORDER.indexOf(b as PayoutTransactionStatus);
    const posA = idxA === -1 ? 999 : idxA;
    const posB = idxB === -1 ? 999 : idxB;
    return posA - posB;
  });
};

export const resolveStatusKey = (value: unknown): PayoutTransactionStatus => {
  const key = normalizeStatusKey(value);

  if (key in STATUS_REGISTRY) return key as PayoutTransactionStatus;

  if (/TOKEN.*(FAIL|ERROR|REJECT)/.test(key))
    return PayoutTransactionStatus.TOKEN_TRANSACTION_FAILED;
  if (/TOKEN.*(COMPLET|SUCCESS)/.test(key))
    return PayoutTransactionStatus.TOKEN_TRANSACTION_COMPLETED;
  if (/TOKEN.*INIT/.test(key))
    return PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED;

  if (/FIAT.*(FAIL|ERROR|REJECT)/.test(key))
    return PayoutTransactionStatus.FIAT_TRANSACTION_FAILED;
  if (/FIAT.*(COMPLET|SUCCESS)/.test(key))
    return PayoutTransactionStatus.FIAT_TRANSACTION_COMPLETED;
  if (/FIAT.*INIT/.test(key))
    return PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED;

  if (/(CANCEL|CANCLE)/.test(key)) return PayoutTransactionStatus.CANCELLED;
  if (/PARTIAL/.test(key)) return PayoutTransactionStatus.PARTIALLY_COMPLETED;
  if (/(FAIL|ERROR|REJECT)/.test(key)) return PayoutTransactionStatus.FAILED;
  if (/(COMPLETE|SUCCESS|PAID|DISBURSE)/.test(key))
    return PayoutTransactionStatus.COMPLETED;

  return PayoutTransactionStatus.PENDING;
};

export const resolveStatusMeta = (value: unknown): StatusMeta =>
  STATUS_REGISTRY[resolveStatusKey(value)];

export const getStatusCategory = (value: unknown): StatusCategory =>
  resolveStatusMeta(value).category;

export const getStatusColor = (value: unknown): string =>
  resolveStatusMeta(value).color;

export const getAllStatusMeta = (): Record<PayoutTransactionStatus, StatusMeta> =>
  STATUS_REGISTRY;

export const getStatusLabel = (value: unknown): string =>
  resolveStatusMeta(value).label;

