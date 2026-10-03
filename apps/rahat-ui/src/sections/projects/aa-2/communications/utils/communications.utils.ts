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

export const resolveTransportByChannel = (
  transports: Transport[] | undefined,
  channel: BroadcastChannel,
): Transport | undefined =>
  transports?.find((transport) =>
    CHANNEL_TRANSPORT_ALIASES[channel].includes(
      normalizeTransportName(transport?.name),
    ),
  );

export const resolveChannelByTransportId = (
  transports: Transport[] | undefined,
  transportId?: string | null,
  audioURL?: { mediaURL?: string } | string | null,
): 'SMS' | 'VOICE' | 'EMAIL' => {
  const name = transports
    ?.find((transport) => transport?.cuid === transportId)
    ?.name?.toUpperCase();
  if (name === 'VOICE') return 'VOICE';
  if (name === 'EMAIL' || name === 'SMTP') return 'EMAIL';
  if (name === 'SMS') return 'SMS';
  if (typeof audioURL === 'object' && audioURL?.mediaURL) return 'VOICE';
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
  | 'COMPLETED';

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
  | (string & {});

export type BroadcastCounts = {
  SUCCESS?: number;
  FAIL?: number;
  PENDING?: number;
  SCHEDULED?: number;
  TOTAL?: number;
};

export const resolveTargetEffectiveStatus = (
  rawStatus?: string | null,
  counts?: BroadcastCounts | null,
): string => {
  const normalized = (rawStatus || '').toUpperCase();

  // Explicit failure on target level (e.g. database target error, session couldn't be created)
  if (normalized === 'FAILED' || normalized === 'FAIL') return 'FAILED';
  if (normalized === 'CANCELLED') return 'CANCELLED';

  if (counts) {
    const success = counts.SUCCESS ?? 0;
    const fail = counts.FAIL ?? 0;
    const pending = counts.PENDING ?? 0;
    const scheduled = counts.SCHEDULED ?? 0;
    const total = counts.TOTAL ?? (success + fail + pending + scheduled);

    if (total > 0) {
      if (pending > 0 || scheduled > 0) {
        return 'IN_PROGRESS';
      }
      if (fail > 0 && success === 0) {
        return 'FAILED';
      }
      if (success > 0 && fail === 0) {
        return 'DELIVERED';
      }
      if (success > 0 && fail > 0) {
        return 'FAILED';
      }
    }
  }

  if (normalized === 'SENT') {
    return 'SENT';
  }

  if (normalized === 'PROCESSING') {
    return 'PROCESSING';
  }

  if (normalized === 'IN_PROGRESS') {
    return 'IN_PROGRESS';
  }

  if (normalized === 'PENDING') {
    return 'PENDING';
  }

  return normalized || 'PENDING';
};

export const aggregateTargetStatus = (
  targets: { status?: string; sessionId?: string | null }[] | undefined,
  countsMap?: Record<string, BroadcastCounts>,
): TargetAggregateStatus => {
  if (!targets || targets.length === 0) return 'PENDING';

  let hasFailed = false;
  let hasPending = false;
  let hasSuccess = false;

  for (const target of targets) {
    const counts = target.sessionId && countsMap ? countsMap[target.sessionId] : null;
    const eff = resolveTargetEffectiveStatus(target.status, counts);

    if (eff === 'FAILED' || eff === 'FAIL' || eff === 'NO ANSWER' || eff === 'BUSY' || eff === 'REJECTED') {
      hasFailed = true;
    } else if (eff === 'PENDING' || eff === 'IN_PROGRESS' || eff === 'PROCESSING') {
      hasPending = true;
    } else if (eff === 'DELIVERED' || eff === 'SUCCESS' || eff === 'COMPLETED' || eff === 'ANSWERED' || eff === 'SENT') {
      hasSuccess = true;
    }
  }

  if (hasPending) return 'IN_PROGRESS';
  if (hasFailed && !hasSuccess) return 'FAILED';
  if (hasSuccess && !hasFailed) return 'DELIVERED';
  if (hasFailed && hasSuccess) return 'FAILED';

  return 'PENDING';
};

export const resolveBroadcastLogStatus = (
  row: any,
  channel: string
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
    (isFail ? (channel === 'VOICE' ? 'Call not answered / failed' : 'Delivery failed') : null);

  return {
    displayStatus,
    isFail,
    isSuccess,
    failReason,
    durationSec
  };
};


