import { Project } from '@rahataid/sdk/project/project.types';
import {
  ChannelWiseStats,
  CommunicationActivityItem,
  CommunicationLogsFilterParams,
  CommunicationOverviewData,
  GroupDeliveryStats,
  RecipientWiseStats,
  TargetProject,
  TransportEntry,
  GroupTransportStats,
  ResolvedTransportInfo,
} from './communication-overview.types';

export const EMPTY_ACTIVITIES: CommunicationActivityItem[] = [];
export const EMPTY_PROJECTS: Project[] = [];
export const RECIPIENT_GROUPS = ['beneficiary', 'stakeholder'] as const;
export const STALE_5MIN = 5 * 60 * 1000;

const VOICE_PATTERN = /VOICE|IVR|AUDIO|CALL|AWAAZ|TELEPHONY|PHONE/i;
const EMAIL_PATTERN = /EMAIL|SMTP|MAIL|SENDGRID/i;
const WHATSAPP_PATTERN = /WHATSAPP|^WA$/i;
const SMS_PATTERN = /SMS|SPARROW|TWILIO|API|SES|ECHO|TEXT/i;

const DEFAULT_TRANSPORT_NAMES: Record<string, string> = {
  VOICE: 'IVR',
  EMAIL: 'Email',
  WHATSAPP: 'WhatsApp',
  SMS: 'SMS',
};

const CANONICAL_NAMES: Record<string, string> = {
  VOICE: 'Voice',
  EMAIL: 'Email',
  WHATSAPP: 'WhatsApp',
  SMS: 'SMS',
};

export function classifyTransportString(raw?: string | null): string {
  if (!raw) return 'SMS';
  const str = String(raw).trim();
  if (VOICE_PATTERN.test(str)) return 'VOICE';
  if (EMAIL_PATTERN.test(str)) return 'EMAIL';
  if (WHATSAPP_PATTERN.test(str)) return 'WHATSAPP';
  if (SMS_PATTERN.test(str)) return 'SMS';
  return str.toUpperCase() || 'SMS';
}

export function resolveTransportInfo(
  comm?: Record<string, unknown> | null,
  transports?: TransportEntry[],
): ResolvedTransportInfo {
  if (!comm) {
    return { channel: 'SMS', transportName: 'SMS' };
  }

  const msg = comm['message'];
  const hasAudio =
    Boolean(comm['audioURL']) ||
    (typeof comm['audioURL'] === 'object' &&
      comm['audioURL'] !== null &&
      Object.keys(comm['audioURL']).length > 0) ||
    (typeof msg === 'object' && msg !== null) ||
    (typeof msg === 'string' &&
      (/\.(mp3|wav|ogg|m4a)/i.test(msg) || msg.includes('/audio/')));

  const hasSubject =
    typeof comm['subject'] === 'string' && comm['subject'].trim().length > 0;

  const tid = comm['transportId'];
  const matchedTransport =
    tid && Array.isArray(transports)
      ? transports.find((t) => t?.cuid === tid || t?.id === tid)
      : undefined;

  const sessionDetails = comm['sessionDetails'] as Record<string, unknown> | undefined;
  const sessionTransport = sessionDetails?.['Transport'] as Record<string, unknown> | undefined;

  const rawCandidate =
    (matchedTransport?.name as string) ||
    (sessionTransport?.['name'] as string) ||
    (comm['transportName'] as string) ||
    (matchedTransport?.type as string) ||
    (comm['communicationType'] as string) ||
    (comm['type'] as string) ||
    '';

  const CANONICAL_CHANNELS = new Set(['SMS', 'VOICE', 'EMAIL', 'WHATSAPP']);
  let channel: 'SMS' | 'VOICE' | 'EMAIL' | 'WHATSAPP' = 'SMS';
  if (hasAudio) {
    channel = 'VOICE';
  } else if (hasSubject) {
    channel = 'EMAIL';
  } else if (rawCandidate) {
    const classified = classifyTransportString(rawCandidate);
    if (CANONICAL_CHANNELS.has(classified)) {
      channel = classified as typeof channel;
    }
  }

  const trimmed = rawCandidate ? String(rawCandidate).trim() : '';
  const transportName = trimmed
    ? (CANONICAL_NAMES[trimmed.toUpperCase()] ?? trimmed)
    : DEFAULT_TRANSPORT_NAMES[channel];

  return { channel, transportName };
}

export function resolveTransportChannel(
  comm: Record<string, unknown>,
  transports?: TransportEntry[],
): string {
  return resolveTransportInfo(comm, transports).channel;
}

export function emptyGroupStats(): GroupDeliveryStats {
  return { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 };
}

export function applySuccessRate(stats: GroupDeliveryStats) {
  stats.successRate =
    stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0;
}

export function unwrapGroupStats(response: unknown): GroupTransportStats | null {
  let current = response as Record<string, unknown> | undefined;
  while (current && typeof current === 'object') {
    if (current['beneficiary'] || current['stakeholder']) {
      return current as GroupTransportStats;
    }
    current = current['data'] as Record<string, unknown> | undefined;
  }
  return null;
}

export function mergeTransportStats(
  base: GroupTransportStats,
  incoming: GroupTransportStats,
): GroupTransportStats {
  const result: GroupTransportStats = {
    beneficiary: { ...base.beneficiary },
    stakeholder: { ...base.stakeholder },
  };

  for (const group of RECIPIENT_GROUPS) {
    const groupMap = { ...(result[group] ?? {}) };
    result[group] = groupMap;
    const src = incoming[group];
    if (!src) continue;

    for (const [transport, counts] of Object.entries(src)) {
      const existing = groupMap[transport];
      if (!existing) {
        groupMap[transport] = { ...counts };
      } else {
        groupMap[transport] = {
          SUCCESS: (existing.SUCCESS || 0) + (counts.SUCCESS || 0),
          FAIL: (existing.FAIL || 0) + (counts.FAIL || 0),
          PENDING: (existing.PENDING || 0) + (counts.PENDING || 0),
          SCHEDULED: (existing.SCHEDULED || 0) + (counts.SCHEDULED || 0),
          TOTAL: (existing.TOTAL || 0) + (counts.TOTAL || 0),
        };
      }
    }
  }

  return result;
}

export function computeOverviewStats(
  rawGroupStats: GroupTransportStats,
  filters?: { channel?: string; recipient?: string },
): CommunicationOverviewData {
  const normRecipient = (filters?.recipient || '').toUpperCase();
  const rawChannel = (filters?.channel || '').toUpperCase();
  const normChannel =
    rawChannel && rawChannel !== 'ALL' ? classifyTransportString(rawChannel) : '';

  const recipientWise: RecipientWiseStats = {
    beneficiary: emptyGroupStats(),
    stakeholder: emptyGroupStats(),
  };
  const channelWise: ChannelWiseStats = {};

  for (const group of RECIPIENT_GROUPS) {
    const isBen = group === 'beneficiary';
    const transportMap = rawGroupStats?.[group] || {};

    for (const [transportKey, counts] of Object.entries(transportMap)) {
      const channelKey = classifyTransportString(transportKey);

      const matchesChannel = !normChannel || channelKey === normChannel;
      const matchesRecipient =
        !normRecipient ||
        normRecipient === 'ALL' ||
        (normRecipient === 'BENEFICIARY' && isBen) ||
        (normRecipient === 'STAKEHOLDER' && !isBen);

      if (matchesChannel) {
        recipientWise[group].successful += counts['SUCCESS'] || 0;
        recipientWise[group].failed += counts['FAIL'] || 0;
        recipientWise[group].pending +=
          (counts['PENDING'] || 0) + (counts['SCHEDULED'] || 0);
        recipientWise[group].total += counts['TOTAL'] || 0;
      }

      if (matchesRecipient && matchesChannel) {
        const stats = channelWise[channelKey] || emptyGroupStats();
        channelWise[channelKey] = stats;
        stats.successful += counts['SUCCESS'] || 0;
        stats.failed += counts['FAIL'] || 0;
        stats.pending +=
          (counts['PENDING'] || 0) + (counts['SCHEDULED'] || 0);
        stats.total += counts['TOTAL'] || 0;
      }
    }
  }

  for (const g of RECIPIENT_GROUPS) applySuccessRate(recipientWise[g]);
  for (const ch of Object.values(channelWise)) applySuccessRate(ch);

  const groups =
    !normRecipient || normRecipient === 'ALL'
      ? RECIPIENT_GROUPS
      : normRecipient === 'BENEFICIARY'
        ? (['beneficiary'] as const)
        : (['stakeholder'] as const);

  let totalComms = 0;
  let success = 0;
  let fail = 0;
  let pend = 0;

  for (const g of groups) {
    totalComms += recipientWise[g].total;
    success += recipientWise[g].successful;
    fail += recipientWise[g].failed;
    pend += recipientWise[g].pending;
  }

  return {
    overall: {
      totalCommunications: totalComms,
      successful: success,
      failed: fail,
      pending: pend,
      totalRecipients: totalComms,
      successRate: totalComms > 0 ? Math.round((success / totalComms) * 100) : 0,
    },
    recipientWise,
    channelWise,
    rawGroupStats,
  };
}

const SUCCESS_STATUSES = new Set([
  'COMPLETED',
  'DELIVERED',
  'SUCCESS',
  'ANSWERED',
]);

const FAILED_STATUSES = new Set([
  'FAILED',
  'FAIL',
  'FAILURE',
  'NO ANSWER',
  'NO_ANSWER',
  'BUSY',
  'REJECTED',
  'CONGESTION',
  'CONGESION',
  'NOT FOUND',
  'UNDELIVERED',
  'ERROR',
  'ERR',
  'BOUNCE',
  'BOUNCED',
  'CANCELLED',
  'CANCELED',
  'UNSUCCESSFUL',
  'TIMEOUT',
  'TIMEDOUT',
  'EXPIRED',
  'UNREACHABLE',
  'DROPPED',
  'BLACKLISTED',
]);

const SUCCESS_STATUS_PATTERN = /COMPLET|DELIVER|SUCCESS|ANSWER/i;
const FAILED_STATUS_PATTERN =
  /FAIL|ERROR|BOUNCE|UNDELIV|NO[_ ]ANSWER|BUSY|REJECT|CONGES|DROP|CANCEL|BLACKLIST|TIMEOUT/i;

export function normalizeSessionStatus(
  raw?: string,
): 'COMPLETED' | 'FAILED' | 'IN_PROGRESS' {
  const s = (raw || '').trim().toUpperCase();
  if (!s) return 'IN_PROGRESS';
  if (SUCCESS_STATUSES.has(s) || SUCCESS_STATUS_PATTERN.test(s)) return 'COMPLETED';
  if (FAILED_STATUSES.has(s) || FAILED_STATUS_PATTERN.test(s)) return 'FAILED';
  return 'IN_PROGRESS';
}

export function computeStatsFromActivities(
  activities: CommunicationActivityItem[],
): CommunicationOverviewData {
  const recipientWise: RecipientWiseStats = {
    beneficiary: emptyGroupStats(),
    stakeholder: emptyGroupStats(),
  };
  const channelWise: ChannelWiseStats = {};

  let successful = 0;
  let failed = 0;
  let pending = 0;
  let totalRecipientsCount = 0;

  for (const item of activities) {
    const isBen = (item.recipientType || '').toUpperCase() === 'BENEFICIARY';
    const groupKey = isBen ? 'beneficiary' : 'stakeholder';
    const ch = (item.channel || 'SMS').toUpperCase();
    const isCompleted = item.status === 'COMPLETED';
    const isFailed = item.status === 'FAILED';

    recipientWise[groupKey].total += 1;
    if (isCompleted) {
      recipientWise[groupKey].successful += 1;
      successful += 1;
    } else if (isFailed) {
      recipientWise[groupKey].failed += 1;
      failed += 1;
    } else {
      recipientWise[groupKey].pending += 1;
      pending += 1;
    }

    const chStats = channelWise[ch] || emptyGroupStats();
    channelWise[ch] = chStats;
    chStats.total += 1;
    if (isCompleted) chStats.successful += 1;
    else if (isFailed) chStats.failed += 1;
    else chStats.pending += 1;

    totalRecipientsCount += item.total || 1;
  }

  for (const g of RECIPIENT_GROUPS) applySuccessRate(recipientWise[g]);
  for (const ch of Object.values(channelWise)) applySuccessRate(ch);

  const total = activities.length;

  return {
    overall: {
      totalCommunications: total,
      successful,
      failed,
      pending,
      totalRecipients: totalRecipientsCount || total,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
    },
    recipientWise,
    channelWise,
    rawGroupStats: {},
  };
}

export function buildTargetProjects(
  projectList: Project[],
  selectedProject?: string,
): TargetProject[] {
  const isAll = !selectedProject || selectedProject === 'all';
  if (isAll) return projectList.map((p) => ({ uuid: p.uuid || '', name: p.name || '' }));
  return [
    {
      uuid: selectedProject,
      name: projectList.find((p) => p.uuid === selectedProject)?.name || selectedProject,
    },
  ];
}

function normalizeRecipientType(raw: string): 'BENEFICIARY' | 'STAKEHOLDER' {
  return raw.toUpperCase().startsWith('STAKEHOLDER') ? 'STAKEHOLDER' : 'BENEFICIARY';
}

function extractPhase(act: Record<string, unknown>): string {
  const phase = act['phase'];
  if (phase && typeof phase === 'object') {
    return String((phase as Record<string, unknown>)['name'] || 'N/A');
  }
  return String(phase || 'N/A');
}

function extractSessionId(...sources: Record<string, unknown>[]): string {
  for (const src of sources) {
    for (const key of ['sessionId', 'session_id', 'cuid']) {
      const val = src[key];
      if (typeof val === 'string' && val.trim() && val !== 'undefined' && val !== 'null') {
        return val.trim();
      }
    }
    const details = src['sessionDetails'] as Record<string, unknown> | undefined;
    if (details) {
      const detailId = details['cuid'] || details['id'];
      if (typeof detailId === 'string' && detailId.trim() && detailId !== 'undefined') {
        return detailId.trim();
      }
    }
  }
  return '';
}

function extractErrorMessage(...candidates: unknown[]): string | undefined {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
    if (candidate && typeof candidate === 'object') {
      const msg = (candidate as Record<string, unknown>)['message'];
      if (typeof msg === 'string' && msg.trim()) return msg.trim();
    }
  }
  return undefined;
}

export function transformActivitiesToCommunicationRows(
  activities: Record<string, unknown>[],
  proj: TargetProject,
  transports?: TransportEntry[],
): CommunicationActivityItem[] {
  const rows: CommunicationActivityItem[] = [];

  for (const act of activities) {
    const rawComms =
      act['activityCommunication'] ??
      act['communications'] ??
      act['communication'];

    const comms = Array.isArray(rawComms)
      ? (rawComms as Record<string, unknown>[])
      : rawComms && typeof rawComms === 'object'
      ? [rawComms as Record<string, unknown>]
      : [];

    if (comms.length === 0) {
      const actStatus = normalizeSessionStatus(String(act['status'] || 'PENDING'));
      const { channel, transportName } = resolveTransportInfo(act, transports);
      const sId = extractSessionId(act);
      const actId = String(act['uuid'] || act['id'] || '').trim();

      rows.push({
        id: actId,
        date: String(act['createdAt'] || new Date().toISOString()),
        projectId: proj.uuid,
        projectName: proj.name,
        title: String(act['title'] || 'Communication Activity'),
        channel,
        transportName,
        groupName: 'General',
        recipientType: normalizeRecipientType(
          String(act['groupType'] || act['recipientType'] || 'BENEFICIARY'),
        ),
        phase: extractPhase(act),
        status: actStatus,
        delivered: actStatus === 'COMPLETED' ? 1 : 0,
        failed: actStatus === 'FAILED' ? 1 : 0,
        pending: actStatus === 'IN_PROGRESS' ? 1 : 0,
        total: 1,
        sessionId: sId,
        activityId: actId,
        failReason: extractErrorMessage(
          act['errorMessage'],
          act['error'],
          act['failReason'],
        ),
      });
      continue;
    }

    for (let idx = 0; idx < comms.length; idx++) {
      const c = comms[idx] as Record<string, unknown>;
      const { channel, transportName } = resolveTransportInfo(c, transports);
      const groupType = normalizeRecipientType(
        String(c['groupType'] || c['recipientType'] || act['groupType'] || act['recipientType'] || 'BENEFICIARY'),
      );

      const hasExplicitFailure =
        Boolean(c['isFailed']) ||
        Boolean(c['hasFailed']) ||
        (typeof c['failedCount'] === 'number' && c['failedCount'] > 0) ||
        (typeof c['failed'] === 'number' && c['failed'] > 0) ||
        (typeof c['fail'] === 'number' && c['fail'] > 0) ||
        Boolean(c['error']) ||
        Boolean(c['errorMessage']) ||
        act['status'] === 'FAILED';

      const rawStatus =
        c['sessionStatus'] ??
        c['status'] ??
        c['deliveryStatus'] ??
        (hasExplicitFailure
          ? 'FAILED'
          : act['status'] === 'COMPLETED'
          ? 'COMPLETED'
          : 'PENDING');

      const status = hasExplicitFailure ? 'FAILED' : normalizeSessionStatus(String(rawStatus));

      const msg = c['message'];
      const phaseName = extractPhase(act);

      const failReason = extractErrorMessage(
        c['failReason'],
        c['errorMessage'],
        c['error'],
        act['errorMessage'],
        act['failReason'],
      );

      const totalRecipients =
        Number(c['totalRecipients'] ?? c['total'] ?? c['recipientCount'] ?? 1) || 1;
      const deliveredRecipients =
        Number(c['deliveredCount'] ?? c['delivered'] ?? c['success'] ?? (status === 'COMPLETED' ? totalRecipients : 0));
      const failedRecipients =
        Number(c['failedCount'] ?? c['failed'] ?? c['fail'] ?? (status === 'FAILED' ? totalRecipients : 0));
      const pendingRecipients = Math.max(
        0,
        totalRecipients - deliveredRecipients - failedRecipients,
      );

      const sId = extractSessionId(c, act);

      const commId = String(c['communicationId'] || c['id'] || '').trim();
      const actId = String(act['uuid'] || act['id'] || '').trim();
      const subject =
        typeof c['subject'] === 'string' && c['subject'].trim()
          ? c['subject'].trim()
          : undefined;

      rows.push({
        id: `${actId}-${sId || commId || idx}`,
        date: String(act['createdAt'] || new Date().toISOString()),
        projectId: proj.uuid,
        projectName: proj.name,
        title: String(act['title'] || c['groupName'] || 'Communication'),
        channel,
        transportName,
        groupName: String(
          c['groupName'] ||
          (groupType === 'BENEFICIARY' ? 'Beneficiaries' : 'Stakeholders'),
        ),
        recipientType: groupType,
        phase: phaseName,
        status,
        delivered: deliveredRecipients,
        failed: failedRecipients,
        pending: pendingRecipients,
        total: totalRecipients,
        sessionId: sId,
        communicationId: commId || undefined,
        activityId: actId,
        subject,
        message:
          typeof msg === 'string'
            ? msg
            : ((msg as Record<string, unknown>)?.[('mediaURL')] as string),
        failReason,
      });
    }
  }

  return rows;
}

export function filterCommunicationActivities(
  activities: CommunicationActivityItem[],
  params?: CommunicationLogsFilterParams,
): CommunicationActivityItem[] {
  if (!activities.length) return EMPTY_ACTIVITIES;
  let result = activities;

  if (params?.status && params.status !== 'all') {
    const st = params.status.toUpperCase();
    if (st === 'IN_PROGRESS' || st === 'PENDING') {
      result = result.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'PENDING');
    } else {
      result = result.filter((r) => r.status === st);
    }
  }
  if (params?.channel && params.channel !== 'all') {
    const target = classifyTransportString(params.channel);
    result = result.filter(
      (r) => classifyTransportString(r.channel) === target,
    );
  }
  if (params?.recipient && params.recipient !== 'all') {
    const rc = params.recipient.toUpperCase();
    result = result.filter((r) => (r.recipientType || '').toUpperCase() === rc);
  }
  if (params?.phase && params.phase !== 'all') {
    const ph = params.phase.toUpperCase();
    result = result.filter((r) => r.phase?.toUpperCase() === ph);
  }
  if (params?.from) {
    const fromTime = new Date(`${params.from}T00:00:00`).getTime();
    if (!isNaN(fromTime)) {
      result = result.filter((r) => {
        const itemTime = new Date(r.date).getTime();
        return isNaN(itemTime) || itemTime >= fromTime;
      });
    }
  }
  if (params?.to) {
    const toTime = new Date(`${params.to}T23:59:59.999`).getTime();
    if (!isNaN(toTime)) {
      result = result.filter((r) => {
        const itemTime = new Date(r.date).getTime();
        return isNaN(itemTime) || itemTime <= toTime;
      });
    }
  }
  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.projectName?.toLowerCase().includes(q) ||
          r.groupName?.toLowerCase().includes(q) ||
          r.channel.toLowerCase().includes(q) ||
          (r.transportName && r.transportName.toLowerCase().includes(q)) ||
          r.phase?.toLowerCase().includes(q) ||
          r.recipientType.toLowerCase().includes(q),
      );
    }
  }

  return result;
}
