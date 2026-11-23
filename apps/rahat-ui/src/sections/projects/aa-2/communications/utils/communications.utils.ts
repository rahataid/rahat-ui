import { Transport } from '@rumsan/connect/src/types';
import { normalizeTransportName } from 'apps/rahat-ui/src/utils/string';
import { exportToExcel } from 'apps/rahat-ui/src/utils/exportToExcle';
import { formatDateFull } from 'apps/rahat-ui/src/utils/dateFormate';
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

export type ExportLogsOptions = {
  title?: string;
  groupName?: string;
  groupType?: string;
  channel?: 'SMS' | 'VOICE' | 'EMAIL' | string;
  onlyFailed?: boolean;
  message?: string;
  subject?: string;
  sessionStartedAt?: string;
  sessionEndedAt?: string;
  formatDate?: (date: any) => string;
  naLabel?: string;
};

export const exportCommunicationLogs = async (
  logs: any[],
  options: ExportLogsOptions = {},
): Promise<boolean> => {
  if (!Array.isArray(logs) || logs.length === 0) return false;

  const {
    title = 'communication',
    groupName = 'group',
    groupType = 'N/A',
    channel = 'SMS',
    onlyFailed = false,
    message,
    subject,
    sessionStartedAt,
    sessionEndedAt,
    formatDate,
    naLabel = 'N/A',
  } = options;

  const transport = (channel || 'SMS').toUpperCase();

  let targetRows = logs;
  if (onlyFailed) {
    targetRows = logs.filter((log: any) => {
      const rawStatus = (log?.status || '').toUpperCase();
      const logStatus = resolveBroadcastLogStatus(log, transport);
      return rawStatus === 'FAIL' || rawStatus === 'FAILED' || logStatus.isFail;
    });
    if (targetRows.length === 0) return false;
  }

  const formatDateFn = (dateStr: any) => {
    if (!dateStr) return '';
    if (formatDate) {
      try {
        return formatDate(dateStr);
      } catch {
        return formatDateFull(String(dateStr));
      }
    }
    return formatDateFull(String(dateStr));
  };

  const formattedRows = targetRows.map((log: any) => {
    const logStatus = resolveBroadcastLogStatus(log, transport);
    const rawDisp =
      typeof log.disposition?.disposition === 'string'
        ? log.disposition.disposition
        : log.disposition?.error ||
          (typeof log.disposition === 'string' ? log.disposition : '');

    const durationVal =
      logStatus.durationSec != null
        ? String(logStatus.durationSec)
        : log.duration != null
        ? String(log.duration)
        : '';

    const addressVal =
      log.address || log.phone || log.email || log.name || '';

    if (transport === 'VOICE') {
      return {
        'Group Name': groupName || naLabel,
        'Group Type': groupType || naLabel,
        'Communication Type': transport,
        'Communication Title': title || '',
        'Audience Number': addressVal,
        Status: logStatus.displayStatus || log.status || '',
        Disposition: rawDisp || (logStatus.failReason || ''),
        Duration: durationVal,
        Attempts: log.attempts ?? 1,
        'Max Attempts': log.maxAttempts ?? '',
        'Is Complete': log.isComplete != null ? String(log.isComplete) : '',
        'Triggered Date': (log.createdAt || log.updatedAt)
          ? formatDateFn(log.createdAt || log.updatedAt)
          : '',
        'Created Date': log.createdAt ? formatDateFn(log.createdAt) : '',
        'Updated Date': log.updatedAt ? formatDateFn(log.updatedAt) : '',
        'Session Start Date': sessionStartedAt
          ? formatDateFn(sessionStartedAt)
          : '',
        'Session End Date': sessionEndedAt ? formatDateFn(sessionEndedAt) : '',
        'Last Attempt': log.lastAttempt
          ? formatDateFn(log.lastAttempt)
          : '',
      };
    }

    if (transport === 'EMAIL') {
      return {
        'Group Name': groupName || naLabel,
        'Group Type': groupType || naLabel,
        'Communication Type': transport,
        'Communication Title': title || '',
        Subject: subject ?? '',
        Message: message ?? '',
        'Audience Email': addressVal,
        Status: logStatus.displayStatus || log.status || '',
        Attempts: log.attempts ?? 1,
        'Max Attempts': log.maxAttempts ?? '',
        'Is Complete': log.isComplete != null ? String(log.isComplete) : '',
        'Triggered Date': (log.createdAt || log.updatedAt)
          ? formatDateFn(log.createdAt || log.updatedAt)
          : '',
        'Created Date': log.createdAt ? formatDateFn(log.createdAt) : '',
        'Updated Date': log.updatedAt ? formatDateFn(log.updatedAt) : '',
        'Last Attempt': log.lastAttempt
          ? formatDateFn(log.lastAttempt)
          : '',
      };
    }

    // Default: SMS
    return {
      'Group Name': groupName || naLabel,
      'Group Type': groupType || naLabel,
      'Communication Type': transport,
      'Communication Title': title || '',
      Message: message ?? '',
      'Audience Number': addressVal,
      Status: logStatus.displayStatus || log.status || '',
      Attempts: log.attempts ?? 1,
      'Max Attempts': log.maxAttempts ?? '',
      'Is Complete': log.isComplete != null ? String(log.isComplete) : '',
      'Triggered Date': (log.createdAt || log.updatedAt)
        ? formatDateFn(log.createdAt || log.updatedAt)
        : '',
      'Created Date': log.createdAt ? formatDateFn(log.createdAt) : '',
      'Updated Date': log.updatedAt ? formatDateFn(log.updatedAt) : '',
      'Last Attempt': log.lastAttempt
        ? formatDateFn(log.lastAttempt)
        : '',
    };
  });

  const cleanTitle = (title || 'communication').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanGroup = (groupName || 'group').replace(/[^a-zA-Z0-9_-]/g, '_');
  const typeSuffix = onlyFailed ? 'failed_deliveries' : 'logs';
  const fileName = `${cleanTitle}_${cleanGroup}_${typeSuffix}_${new Date().toISOString().slice(0, 10)}`;

  await exportToExcel(formattedRows, fileName);
  return true;
};

export type ExportTargetSummaryOptions = {
  title?: string;
  formatDate?: (date: any) => string;
  getGroupDetails?: (id: string, type: string, obj?: any) => { name: string; count: number };
  channel?: string;
};

export const exportCommunicationTargetSummary = async (
  targets: any[],
  options: ExportTargetSummaryOptions = {},
): Promise<boolean> => {
  if (!Array.isArray(targets) || targets.length === 0) return false;

  const { title = 'communication', formatDate, getGroupDetails, channel = 'SMS' } = options;

  const formatDateFn = (dateStr: any) => {
    if (!dateStr) return 'N/A';
    if (formatDate) {
      try {
        return formatDate(dateStr);
      } catch {
        return formatDateFull(String(dateStr));
      }
    }
    return formatDateFull(String(dateStr));
  };

  const formattedRows = targets.map((target: any) => {
    const groupInfo = getGroupDetails
      ? getGroupDetails(target?.groupId, target?.groupType, target?.group)
      : { name: target?.group?.name || target?.groupId || 'N/A', count: target?.group?.count ?? 0 };

    return {
      'Group Name': groupInfo.name,
      'Group Type': target?.groupType || 'BENEFICIARY',
      'Audience Count': groupInfo.count,
      'Communication Title': title,
      'Communication Type': channel,
      'Session ID': target?.sessionId || 'N/A',
      Status: target?.status || 'PENDING',
      'Updated Date': target?.updatedAt
        ? formatDateFn(target.updatedAt)
        : 'N/A',
    };
  });

  const cleanTitle = (title || 'communication').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanTitle}_audience_groups_${new Date().toISOString().slice(0, 10)}`;

  await exportToExcel(formattedRows, fileName);
  return true;
};



