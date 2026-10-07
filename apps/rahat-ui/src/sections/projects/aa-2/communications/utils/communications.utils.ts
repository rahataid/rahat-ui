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
};


export const resolveCommunicationLifecycleStatus = ({
  channel = 'SMS',
  rawStatus,
  counts,
  hasActiveTargets = false,
  hasPendingTargets = false,
  hasSession = false,
  isRetrying = false,
}: CommunicationLifecycleInput): string => {
  if (counts) {
    const success = counts.SUCCESS ?? 0;
    const fail = counts.FAIL ?? 0;
    const active = (counts.PENDING ?? 0) + (counts.SCHEDULED ?? 0);

    if (success > 0 && active === 0 && fail === 0) {
      return 'COMPLETED';
    }

    if (isRetrying && (fail > 0 || active > 0)) {
      return 'IN_PROGRESS';
    }

    if (success === 0 && fail === 0) {
      if ((counts.PENDING ?? 0) > 0) return 'IN_PROGRESS';
      if ((counts.SCHEDULED ?? 0) > 0) return 'SCHEDULED';
    }

    if (active > 0 && (success > 0 || fail > 0)) {
      return 'IN_PROGRESS';
    }

    if (fail > 0 && active === 0) {
      return 'FAILED';
    }
  }

  if (isRetrying) return 'IN_PROGRESS';
  if (hasActiveTargets) return 'IN_PROGRESS';
  if (hasPendingTargets && !hasSession) return 'NOT_STARTED';

  const normalized = (rawStatus || '').toUpperCase();
  const DIRECT_STATUS_MAP: Record<string, string> = {
    FAILED: 'FAILED',
    FAIL: 'FAILED',
    CANCELLED: 'CANCELLED',
    SENT: 'IN_PROGRESS',
    PROCESSING: 'IN_PROGRESS',
    IN_PROGRESS: 'IN_PROGRESS',
    PENDING: hasSession ? 'IN_PROGRESS' : 'NOT_STARTED',
    NOT_STARTED: 'NOT_STARTED',
    'NOT STARTED': 'NOT_STARTED',
    SCHEDULED: 'SCHEDULED',
    DELIVERED: 'COMPLETED',
    SUCCESS: 'COMPLETED',
    ANSWERED: 'COMPLETED',
    COMPLETED: 'COMPLETED',
  };

  return DIRECT_STATUS_MAP[normalized] || normalized || 'NOT_STARTED';
};

export const resolveTargetEffectiveStatus = (
  rawStatus?: string | null,
  counts?: BroadcastCounts | null,
  channel = 'SMS',
): string => {
  const normalized = (rawStatus || '').toUpperCase();
  return resolveCommunicationLifecycleStatus({
    channel,
    rawStatus,
    counts,
    hasActiveTargets: normalized === 'SENT' || normalized === 'PROCESSING' || normalized === 'IN_PROGRESS',
    hasPendingTargets: normalized === 'PENDING' || normalized === 'NOT_STARTED',
    hasSession: !!counts,
  });
};

export const aggregateTargetStatus = (
  targets: { status?: string; sessionId?: string | null }[] | undefined,
  countsMap?: Record<string, BroadcastCounts>,
  channel = 'SMS',
): TargetAggregateStatus => {
  const list = toArray<{ status?: string; sessionId?: string | null }>(
    targets,
  );
  if (!list || list.length === 0) return 'NOT_STARTED';

  let hasFailed = false;
  let hasPending = false;
  let hasSuccess = false;
  let hasActive = false;

  for (const target of list) {
    const counts = target.sessionId && countsMap ? countsMap[target.sessionId] : null;
    const eff = resolveTargetEffectiveStatus(target.status, counts, channel);

    if (eff === 'FAILED' || eff === 'FAIL' || eff === 'NO ANSWER' || eff === 'BUSY' || eff === 'REJECTED') {
      hasFailed = true;
    } else if (eff === 'IN_PROGRESS' || eff === 'PROCESSING') {
      hasActive = true;
    } else if (eff === 'PENDING' || eff === 'SCHEDULED' || eff === 'NOT_STARTED') {
      hasPending = true;
    } else if (eff === 'DELIVERED' || eff === 'SUCCESS' || eff === 'COMPLETED' || eff === 'ANSWERED') {
      hasSuccess = true;
    }
  }

  if (hasActive || ((hasSuccess || hasFailed) && hasPending)) return 'IN_PROGRESS';
  if (hasPending && !hasSuccess && !hasFailed) return 'NOT_STARTED';
  if (hasFailed) return 'FAILED';
  if (hasSuccess) return 'COMPLETED';

  return 'NOT_STARTED';
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



