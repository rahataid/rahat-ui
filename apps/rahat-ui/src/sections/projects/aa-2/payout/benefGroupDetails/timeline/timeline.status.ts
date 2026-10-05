import { PayoutTransactionStatus } from 'apps/rahat-ui/src/utils/get-status-bg';

// ---------------------------------------------------------------------------
// Canonical status identity — every `PayoutTransactionStatus` value carries a
// colour, a human label, and a category so the timeline can render each status
// as its own chart series while still allowing grouped filtering.
// ---------------------------------------------------------------------------

/**
 * Broad category used only for fallback grouping and badge styling when a
 * status is unknown. The timeline chart itself plots one series per real
 * status — it does NOT collapse into 3 buckets.
 */
export type StatusCategory = 'completed' | 'pending' | 'failed';

export type StatusMeta = {
  /** Human-readable label for legend / tooltip (e.g. "Token Initiated"). */
  label: string;
  /** Hex chart colour. */
  color: string;
  /** Broad category — only for fallback grouping. */
  category: StatusCategory;
};

// ---------------------------------------------------------------------------
// Colour palette — distinct hue per status, grouped so related statuses are
// visually adjacent. Carefully chosen for accessibility on white backgrounds.
// ---------------------------------------------------------------------------

const STATUS_REGISTRY: Record<PayoutTransactionStatus, StatusMeta> = {
  // --- Pending / In-Progress ---
  [PayoutTransactionStatus.PENDING]: {
    label: 'Pending',
    color: '#F59E0B', // amber-500
    category: 'pending',
  },
  [PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED]: {
    label: 'Token Initiated',
    color: '#8B5CF6', // violet-500
    category: 'pending',
  },
  [PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED]: {
    label: 'Fiat Initiated',
    color: '#6366F1', // indigo-500
    category: 'pending',
  },

  // --- Completed / Success ---
  [PayoutTransactionStatus.TOKEN_TRANSACTION_COMPLETED]: {
    label: 'Token Completed',
    color: '#10B981', // emerald-500
    category: 'completed',
  },
  [PayoutTransactionStatus.FIAT_TRANSACTION_COMPLETED]: {
    label: 'Fiat Completed',
    color: '#14B8A6', // teal-500
    category: 'completed',
  },
  [PayoutTransactionStatus.COMPLETED]: {
    label: 'Completed',
    color: '#22C55E', // green-500
    category: 'completed',
  },
  [PayoutTransactionStatus.PARTIALLY_COMPLETED]: {
    label: 'Partially Completed',
    color: '#84CC16', // lime-500
    category: 'completed',
  },

  // --- Failed / Cancelled ---
  [PayoutTransactionStatus.TOKEN_TRANSACTION_FAILED]: {
    label: 'Token Failed',
    color: '#EF4444', // red-500
    category: 'failed',
  },
  [PayoutTransactionStatus.FIAT_TRANSACTION_FAILED]: {
    label: 'Fiat Failed',
    color: '#F97316', // orange-500
    category: 'failed',
  },
  [PayoutTransactionStatus.FAILED]: {
    label: 'Failed',
    color: '#DC2626', // red-600
    category: 'failed',
  },
  [PayoutTransactionStatus.CANCELLED]: {
    label: 'Cancelled',
    color: '#9CA3AF', // gray-400
    category: 'failed',
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const normalizeStatusKey = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

/**
 * Look up the canonical metadata for any payout status value (API string,
 * Excel export, etc.). Returns `undefined` only for truly unknown statuses.
 */
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

/**
 * Resolve the real `PayoutTransactionStatus` key from an arbitrary value.
 * Falls back to keyword-based heuristic for Excel-exported statuses.
 */
export const resolveStatusKey = (value: unknown): PayoutTransactionStatus => {
  const key = normalizeStatusKey(value);

  // Exact match — the happy path for both CVA and FSP data.
  if (key in STATUS_REGISTRY) return key as PayoutTransactionStatus;

  // Specific token-stage matching (FSP)
  if (/TOKEN.*(FAIL|ERROR|REJECT)/.test(key))
    return PayoutTransactionStatus.TOKEN_TRANSACTION_FAILED;
  if (/TOKEN.*(COMPLET|SUCCESS)/.test(key))
    return PayoutTransactionStatus.TOKEN_TRANSACTION_COMPLETED;
  if (/TOKEN.*INIT/.test(key))
    return PayoutTransactionStatus.TOKEN_TRANSACTION_INITIATED;

  // Specific fiat-stage matching (FSP)
  if (/FIAT.*(FAIL|ERROR|REJECT)/.test(key))
    return PayoutTransactionStatus.FIAT_TRANSACTION_FAILED;
  if (/FIAT.*(COMPLET|SUCCESS)/.test(key))
    return PayoutTransactionStatus.FIAT_TRANSACTION_COMPLETED;
  if (/FIAT.*INIT/.test(key))
    return PayoutTransactionStatus.FIAT_TRANSACTION_INITIATED;

  // Generic fallback for non-enum values (DISBURSED, PROCESSING, CANCLELLED, etc.)
  if (/(CANCEL|CANCLE)/.test(key)) return PayoutTransactionStatus.CANCELLED;
  if (/PARTIAL/.test(key)) return PayoutTransactionStatus.PARTIALLY_COMPLETED;
  if (/(FAIL|ERROR|REJECT)/.test(key)) return PayoutTransactionStatus.FAILED;
  if (/(COMPLETE|SUCCESS|PAID|DISBURSE)/.test(key))
    return PayoutTransactionStatus.COMPLETED;

  return PayoutTransactionStatus.PENDING;
};

/** Get the StatusMeta for a value, guaranteed to always return a result. */
export const resolveStatusMeta = (value: unknown): StatusMeta =>
  STATUS_REGISTRY[resolveStatusKey(value)];

/**
 * Get the category for a status. Unlike the old `classifyPayoutTransactionStatus`,
 * this is only used for badge styling — NOT for chart series grouping.
 */
export const getStatusCategory = (value: unknown): StatusCategory =>
  resolveStatusMeta(value).category;

/**
 * Get chart colour for a status.
 */
export const getStatusColor = (value: unknown): string =>
  resolveStatusMeta(value).color;

/**
 * Get all registered StatusMeta entries — useful for building dynamic legends.
 */
export const getAllStatusMeta = (): Record<PayoutTransactionStatus, StatusMeta> =>
  STATUS_REGISTRY;

/**
 * Get display label for a status value.
 */
export const getStatusLabel = (value: unknown): string =>
  resolveStatusMeta(value).label;

