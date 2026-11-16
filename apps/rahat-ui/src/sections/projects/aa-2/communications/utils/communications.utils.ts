import { Transport } from '@rumsan/connect/src/types';
import { normalizeTransportName } from 'apps/rahat-ui/src/utils/string';
import { BroadcastChannel } from '../types';

export const CHANNEL_TO_TRANSPORT_NAME: Record<BroadcastChannel, string> = {
  sms: 'SMS',
  voice: 'VOICE',
  email: 'EMAIL',
};

const CHANNEL_TRANSPORT_ALIASES: Record<BroadcastChannel, string[]> = {
  sms: ['SMS', 'API', 'SES', 'ECHO'],
  voice: ['VOICE'],
  email: ['EMAIL', 'SMTP'],
};

const toArray = <T>(value: unknown): T[] | undefined => {
  if (Array.isArray(value)) return value as T[];
  if (value && Array.isArray((value as { data?: unknown }).data)) {
    return (value as { data: T[] }).data;
  }
  return undefined;
};

export const resolveTransportByChannel = (
  transports: Transport[] | undefined,
  channel?: BroadcastChannel | string | null,
): Transport | undefined => {
  if (!channel) return undefined;
  const key = String(channel).toLowerCase() as BroadcastChannel;
  const aliases = CHANNEL_TRANSPORT_ALIASES[key];
  if (!aliases) return undefined;

  return toArray<Transport>(transports)?.find((transport) =>
    aliases.includes(normalizeTransportName(transport?.name)),
  );
};

export const resolveChannelByTransportId = (
  transports: Transport[] | undefined,
  transportId?: string | null,
  audioURL?: { mediaURL?: string; url?: string } | string | null,
): 'SMS' | 'VOICE' | 'EMAIL' => {
  const hasAudio =
    !!audioURL &&
    (typeof audioURL === 'string'
      ? audioURL.trim().length > 0
      : typeof audioURL === 'object' &&
        (!!(audioURL as { mediaURL?: string })?.mediaURL ||
          !!(audioURL as { url?: string })?.url ||
          Object.keys(audioURL).length > 0));

  if (hasAudio) return 'VOICE';

  const transport = toArray<Transport>(transports)?.find(
    (item) => item?.cuid === transportId,
  );
  const name = transport?.name?.toUpperCase() || '';
  const type = String((transport as { type?: string })?.type || '').toUpperCase();

  if (name.includes('VOICE') || type.includes('VOICE')) return 'VOICE';
  if (
    name.includes('EMAIL') ||
    name.includes('SMTP') ||
    type.includes('EMAIL') ||
    type.includes('SMTP')
  )
    return 'EMAIL';
  if (name.includes('SMS') || type.includes('SMS')) return 'SMS';

  return 'SMS';
};

/**
 * Database CommunicationTargetStatus enum matching Prisma schema
 */
export type CommunicationTargetStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SENT'
  | 'FAILED'
  | 'CANCELLED';

/**
 * Telephony & Transport Dispositions
 */
export type TelephonyDispositionStatus =
  | 'ANSWERED'
  | 'NO ANSWER'
  | 'BUSY'
  | 'REJECTED'
  | 'FAILED'
  | 'COMPLETED';

/**
 * Aggregate / Derived Target Statuses used in UI
 */
export type TargetAggregateStatus =
  | 'DELIVERED'
  | 'IN_PROGRESS'
  | 'PROCESSING'
  | 'FAILED'
  | 'PENDING'
  | 'SENT'
  | 'COMPLETED'
  | 'SCHEDULED'
  | 'NOT_STARTED';

/**
 * Union for UI Badges (using string & {} to preserve autocomplete while allowing dynamic strings)
 */
export type CommunicationStatus =
  | CommunicationTargetStatus
  | TelephonyDispositionStatus
  | TargetAggregateStatus
  | 'SUCCESS'
  | 'SCHEDULED'
  | 'FAIL'
  | (string & Record<never, never>);

export type BroadcastCounts = {
  SUCCESS?: number;
  FAIL?: number;
  PENDING?: number;
  SCHEDULED?: number;
  TOTAL?: number;
};

export type CommunicationLifecycleInput = {
  channel?: string;
  rawStatus?: string | null;
  counts?: BroadcastCounts | null;
  hasActiveTargets?: boolean;
  hasPendingTargets?: boolean;
  hasSession?: boolean;
  isRetrying?: boolean;
  isScheduled?: boolean;
  scheduledAt?: string | null;
};

export const toDisplayStatus = (status?: string | null): string => {
  const normalized = (status || '').toUpperCase();
  return normalized === 'PENDING' ? 'IN_PROGRESS' : normalized;
};

export const resolveCommunicationLifecycleStatus = ({
  channel = 'SMS',
  rawStatus,
  counts,
  hasActiveTargets = false,
  hasPendingTargets = false,
  hasSession = false,
  isRetrying = false,
  isScheduled = false,
  scheduledAt,
}: CommunicationLifecycleInput): string => {
  if (isRetrying) return 'IN_PROGRESS';

  if (counts && hasSession) {
    const success = Number(counts.SUCCESS ?? 0);
    const fail = Number(counts.FAIL ?? 0);
    const pending = Number(counts.PENDING ?? 0);
    const scheduled = Number(counts.SCHEDULED ?? 0);
    const active = pending + scheduled;

    if (active > 0) {
      if (pending > 0 || success > 0 || fail > 0) {
        return 'IN_PROGRESS';
      }
      if (scheduled > 0) {
        return 'SCHEDULED';
      }
    }

    if (active === 0) {
      if (fail > 0) {
        return 'FAILED';
      }
      if (success > 0) {
        return 'COMPLETED';
      }
    }
  }

  if (hasActiveTargets) return 'IN_PROGRESS';
  if (
    isScheduled &&
    scheduledAt &&
    new Date(scheduledAt).getTime() > Date.now()
  ) {
    return 'SCHEDULED';
  }
  if (hasPendingTargets && !hasSession) return 'NOT_STARTED';

  const normalized = (rawStatus || '').toUpperCase();
  const DIRECT_STATUS_MAP: Record<string, string> = {
    FAILED: 'FAILED',
    FAIL: 'FAILED',
    CANCELLED: 'CANCELLED',
    CANCELED: 'CANCELLED',
    SENT: hasSession ? 'IN_PROGRESS' : 'NOT_STARTED',
    PROCESSING: 'IN_PROGRESS',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING: hasSession ? 'IN_PROGRESS' : 'NOT_STARTED',
    NOT_STARTED: 'NOT_STARTED',
    'NOT STARTED': 'NOT_STARTED',
    NEW: 'NOT_STARTED',
    SCHEDULED: 'SCHEDULED',
    DELIVERED: 'COMPLETED',
    SUCCESS: 'COMPLETED',
    ANSWERED: 'COMPLETED',
    COMPLETED: 'COMPLETED',
  };

  return DIRECT_STATUS_MAP[normalized] || normalized || 'NOT_STARTED';
};

export const resolveBroadcastLogStatus = (
  row: any,
  channel: string,
  t?: (key: string) => string
): { displayStatus: string; isFail: boolean; isSuccess: boolean; failReason: string | null; durationSec: number | null } => {
  const dispositionRaw =
    typeof row?.disposition?.disposition === 'string'
      ? row.disposition.disposition
      : row?.disposition?.disposition?.disposition || row?.disposition?.error || null;
  const durationSec = row?.disposition?.cdr?.billableseconds ?? null;
  const normalizedRowStatus = (row?.status || '').toUpperCase();
  const normalizedDisp = (dispositionRaw || '').toUpperCase();

  const isSuccess =
    normalizedRowStatus === 'SUCCESS' ||
    normalizedRowStatus === 'DELIVERED' ||
    normalizedDisp === 'ANSWERED';

  const isFail =
    normalizedRowStatus === 'FAIL' ||
    normalizedRowStatus === 'FAILED' ||
    ['NO ANSWER', 'REJECTED', 'BUSY', 'NOT FOUND', 'CONGESTION', 'CONGESION', 'FAILED'].includes(normalizedDisp);

  let displayStatus = normalizedRowStatus;
  if (channel === 'VOICE') {
    if (isSuccess) displayStatus = 'ANSWERED';
    else if (normalizedDisp === 'NO ANSWER') displayStatus = 'NO ANSWER';
    else if (normalizedDisp === 'BUSY') displayStatus = 'BUSY';
    else if (normalizedDisp === 'REJECTED') displayStatus = 'REJECTED';
    else if (isFail) displayStatus = 'FAILED';
  } else {
    if (isSuccess) displayStatus = 'DELIVERED';
    else if (isFail) displayStatus = 'FAILED';
  }

  const failReason =
    dispositionRaw ||
    (isFail ? (channel === 'VOICE' ? t?.('CALL_NOT_ANSWERED_FAILED') || 'Call not answered / failed' : t?.('DELIVERY_FAILED') || 'Delivery failed') : null);

  return {
    displayStatus,
    isFail,
    isSuccess,
    failReason,
    durationSec
  };
};

export const resolveCommunicationLogStatus = resolveBroadcastLogStatus;



