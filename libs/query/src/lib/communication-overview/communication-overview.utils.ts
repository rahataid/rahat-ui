import { Project } from '@rahataid/sdk/project/project.types';
import {
  BroadcastCounts,
  ChannelWiseStats,
  CommunicationActivityItem,
  CommunicationChannel,
  CommunicationLogsFilterParams,
  CommunicationOverviewData,
  DeliveryStatus,
  GroupDeliveryStats,
  RecipientWiseStats,
  TargetProject,
  TransportEntry,
  ResolvedTransportInfo,
} from './communication-overview.types';

export const EMPTY_ACTIVITIES: CommunicationActivityItem[] = [];
export const EMPTY_PROJECTS: Project[] = [];
export const RECIPIENT_GROUPS = ['beneficiary', 'stakeholder'] as const;
export const STALE_5MIN = 5 * 60 * 1000;

const CHANNEL_DISPLAY_NAMES: Record<CommunicationChannel, string> = {
  VOICE: 'Voice',
  EMAIL: 'Email',
  WHATSAPP: 'WhatsApp',
  SMS: 'SMS',
};

export function classifyTransportString(raw?: string | null): CommunicationChannel {
  if (!raw) return 'SMS';
  const val = String(raw).trim().toUpperCase();

  if (val === 'VOICE' || val.includes('VOICE') || val === 'IVR') return 'VOICE';
  if (val === 'EMAIL' || val.includes('EMAIL') || val === 'SMTP') return 'EMAIL';
  if (val === 'WHATSAPP' || val === 'WA') return 'WHATSAPP';
  if (val === 'SMS' || val.includes('SMS') || val === 'API') return 'SMS';

  return 'SMS';
}

function hasAudioPayload(comm: Record<string, unknown>): boolean {
  const audioURL = comm['audioURL'];
  if (
    (typeof audioURL === 'object' && audioURL !== null && Object.keys(audioURL).length > 0) ||
    (typeof audioURL === 'string' && audioURL.trim().length > 0)
  ) {
    return true;
  }
  const msg = comm['message'];
  if (typeof msg === 'string') {
    return /\.(mp3|wav|ogg|m4a)/i.test(msg) || msg.includes('/audio/');
  }
  return Boolean(
    typeof msg === 'object' && msg !== null && (msg as Record<string, unknown>)?.['mediaURL'],
  );
}

function hasSubjectPayload(comm: Record<string, unknown>): boolean {
  return typeof comm['subject'] === 'string' && comm['subject'].trim().length > 0;
}

export function resolveTransportInfo(
  comm?: Record<string, unknown> | null,
  transports?: TransportEntry[],
): ResolvedTransportInfo {
  if (!comm) {
    return { channel: 'SMS', transportName: 'SMS' };
  }

  const tid = comm['transportId'];
  const matchedTransport =
    tid && Array.isArray(transports)
      ? transports.find((t) => t?.cuid === tid || t?.id === tid)
      : undefined;

  if (matchedTransport) {
    const rawType = (matchedTransport.name || matchedTransport.type || '').trim();
    const channel = rawType ? classifyTransportString(rawType) : 'SMS';
    const transportName =
      matchedTransport.name?.trim() ||
      CHANNEL_DISPLAY_NAMES[channel] ||
      'SMS';
    return { channel, transportName };
  }

  if (hasAudioPayload(comm)) {
    return { channel: 'VOICE', transportName: CHANNEL_DISPLAY_NAMES['VOICE'] };
  }

  if (hasSubjectPayload(comm)) {
    return { channel: 'EMAIL', transportName: CHANNEL_DISPLAY_NAMES['EMAIL'] };
  }

  const sessionDetails = comm['sessionDetails'] as Record<string, unknown> | undefined;
  const sessionTransport = sessionDetails?.['Transport'] as Record<string, unknown> | undefined;

  const rawCandidate =
    (sessionTransport?.['name'] as string) ||
    (sessionTransport?.['type'] as string) ||
    (comm['transportName'] as string) ||
    (comm['communicationType'] as string) ||
    (comm['type'] as string) ||
    '';

  const channel = rawCandidate ? classifyTransportString(rawCandidate) : 'SMS';
  const transportName = rawCandidate.trim() || CHANNEL_DISPLAY_NAMES[channel];

  return { channel, transportName };
}

export function emptyGroupStats(): GroupDeliveryStats {
  return { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 };
}

export function applySuccessRate(stats: GroupDeliveryStats) {
  stats.successRate =
    stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0;
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

  let successfulRecipients = 0;
  let failedRecipients = 0;
  let pendingRecipients = 0;
  let totalRecipientsCount = 0;

  for (const item of activities) {
    const isBen = (item.recipientType || '').toUpperCase() === 'BENEFICIARY';
    const groupKey = isBen ? 'beneficiary' : 'stakeholder';
    const ch = classifyTransportString(item.channel || 'SMS');

    const total = Number(item.total) > 0 ? Number(item.total) : 1;
    const delivered =
      typeof item.delivered === 'number'
        ? item.delivered
        : item.status === 'COMPLETED'
          ? total
          : 0;
    const failed =
      typeof item.failed === 'number'
        ? item.failed
        : item.status === 'FAILED'
          ? total
          : 0;
    const pending =
      typeof item.pending === 'number'
        ? item.pending
        : Math.max(0, total - delivered - failed);

    recipientWise[groupKey].total += total;
    recipientWise[groupKey].successful += delivered;
    recipientWise[groupKey].failed += failed;
    recipientWise[groupKey].pending += pending;

    const chStats = channelWise[ch] || emptyGroupStats();
    channelWise[ch] = chStats;
    chStats.total += total;
    chStats.successful += delivered;
    chStats.failed += failed;
    chStats.pending += pending;

    totalRecipientsCount += total;
    successfulRecipients += delivered;
    failedRecipients += failed;
    pendingRecipients += pending;
  }

  for (const g of RECIPIENT_GROUPS) applySuccessRate(recipientWise[g]);
  for (const ch of Object.values(channelWise)) applySuccessRate(ch);

  const totalComms = activities.length;
  const overallSuccessRate =
    totalRecipientsCount > 0
      ? Math.round((successfulRecipients / totalRecipientsCount) * 100)
      : totalComms > 0 && successfulRecipients > 0
        ? Math.round((successfulRecipients / totalComms) * 100)
        : 0;

  return {
    overall: {
      totalCommunications: totalComms,
      successful: successfulRecipients,
      failed: failedRecipients,
      pending: pendingRecipients,
      totalRecipients: totalRecipientsCount || totalComms,
      successRate: overallSuccessRate,
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

export function extractSessionId(...sources: Record<string, unknown>[]): string {
  for (const src of sources) {
    if (!src) continue;
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

export function extractTargetAudience(target: Record<string, unknown>): number {
  if (typeof target['audienceCount'] === 'number' && target['audienceCount'] > 0) {
    return target['audienceCount'];
  }
  const group = target['group'] as Record<string, unknown> | undefined;
  if (group && typeof group === 'object') {
    const countObj = group['_count'] as Record<string, number> | undefined;
    if (countObj) {
      const ben = countObj['beneficiaries'] ?? countObj['groupedBeneficiaries'];
      const stk = countObj['stakeholders'];
      if (typeof ben === 'number' && ben > 0) return ben;
      if (typeof stk === 'number' && stk > 0) return stk;
    }
    const benList = group['beneficiaries'] ?? group['groupedBeneficiaries'];
    if (Array.isArray(benList) && benList.length > 0) return benList.length;
    const stkList = group['stakeholders'];
    if (Array.isArray(stkList) && stkList.length > 0) return stkList.length;
  }
  return 0;
}

export function extractTargetGroupName(
  target: Record<string, unknown>,
  recipientType: 'BENEFICIARY' | 'STAKEHOLDER',
): string {
  const group = target['group'] as Record<string, unknown> | undefined;
  if (group && typeof group['name'] === 'string' && group['name'].trim()) {
    return group['name'].trim();
  }
  if (typeof target['groupName'] === 'string' && target['groupName'].trim()) {
    return target['groupName'].trim();
  }
  return recipientType === 'BENEFICIARY' ? 'Beneficiaries' : 'Stakeholders';
}

export function resolveTargetCountsAndStatus(
  rawStatus?: string,
  counts?: BroadcastCounts | null,
  expectedAudience = 1,
): {
  status: DeliveryStatus;
  delivered: number;
  failed: number;
  pending: number;
  total: number;
} {
  const norm = (rawStatus || '').toUpperCase();
  const isDbFailed = norm === 'FAILED' || norm === 'CANCELLED' || norm === 'FAIL';

  if (counts && counts.TOTAL !== undefined && counts.TOTAL !== null) {
    const delivered = counts.SUCCESS ?? 0;
    const failed = counts.FAIL ?? 0;
    const pending = (counts.PENDING ?? 0) + (counts.SCHEDULED ?? 0);
    const total =
      counts.TOTAL > 0 ? counts.TOTAL : Math.max(expectedAudience, delivered + failed + pending, 1);

    const status: DeliveryStatus =
      pending > 0
        ? 'IN_PROGRESS'
        : delivered > 0
          ? 'COMPLETED'
          : failed > 0 || isDbFailed
            ? 'FAILED'
            : SUCCESS_STATUSES.has(norm)
              ? 'COMPLETED'
              : 'IN_PROGRESS';

    return { status, delivered, failed, pending, total };
  }

  const total = expectedAudience > 0 ? expectedAudience : 1;
  if (isDbFailed) {
    return { status: 'FAILED', delivered: 0, failed: total, pending: 0, total };
  }
  if (SUCCESS_STATUSES.has(norm)) {
    return { status: 'COMPLETED', delivered: total, failed: 0, pending: 0, total };
  }
  return { status: 'IN_PROGRESS', delivered: 0, failed: 0, pending: total, total };
}

export function transformActivitiesToCommunicationRows(
  activities: Record<string, unknown>[],
  proj: TargetProject,
  transports?: TransportEntry[],
  sessionCountsMap?: Map<string, BroadcastCounts>,
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
      const counts = sId && sessionCountsMap ? sessionCountsMap.get(sId) : null;
      const resolved = resolveTargetCountsAndStatus(actStatus, counts, 1);

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
        status: resolved.status,
        delivered: resolved.delivered,
        failed: resolved.failed,
        pending: resolved.pending,
        total: resolved.total,
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

      const sId = extractSessionId(c, act);
      const counts = sId && sessionCountsMap ? sessionCountsMap.get(sId) : null;

      const expectedAudience =
        extractTargetAudience(c) ||
        Number(c['totalRecipients'] ?? c['total'] ?? c['recipientCount'] ?? 1);

      const resolved = resolveTargetCountsAndStatus(
        hasExplicitFailure ? 'FAILED' : String(rawStatus),
        counts,
        expectedAudience,
      );

      const msg = c['message'];
      const phaseName = extractPhase(act);

      const failReason = extractErrorMessage(
        c['failReason'],
        c['errorMessage'],
        c['error'],
        act['errorMessage'],
        act['failReason'],
      );

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
        status: resolved.status,
        delivered: resolved.delivered,
        failed: resolved.failed,
        pending: resolved.pending,
        total: resolved.total,
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

export function transformCommunicationsToCommunicationRows(
  communications: Record<string, unknown>[],
  proj: TargetProject,
  transports?: TransportEntry[],
  sessionCountsMap?: Map<string, BroadcastCounts>,
): CommunicationActivityItem[] {
  const rows: CommunicationActivityItem[] = [];

  for (const comm of communications) {
    const commUuid = String(comm['uuid'] || '');
    const title = String(comm['title'] || 'Communication');
    const date = String(comm['createdAt'] || new Date().toISOString());
    const message = comm['message'] as string | undefined;
    const subject = comm['subject'] as string | undefined;
    const { channel, transportName } = resolveTransportInfo(comm as Record<string, unknown>, transports);
    const targets = Array.isArray(comm['targets']) ? (comm['targets'] as Record<string, unknown>[]) : [];

    if (!targets.length) {
      const sessionId = extractSessionId(comm);
      const counts = sessionId && sessionCountsMap ? sessionCountsMap.get(sessionId) : null;
      const { status, delivered, failed, pending, total } = resolveTargetCountsAndStatus(
        String(comm['status'] || 'IN_PROGRESS'),
        counts,
        1,
      );

      rows.push({
        id: `comm-${commUuid}`,
        date,
        projectId: proj.uuid,
        projectName: proj.name,
        title,
        channel,
        transportName,
        groupName: 'General',
        recipientType: 'BENEFICIARY',
        status,
        delivered,
        failed,
        pending,
        total,
        sessionId: sessionId || undefined,
        communicationId: commUuid,
        subject: subject?.trim() || undefined,
        message,
      });
      continue;
    }

    for (const target of targets) {
      const targetUuid = String(target['uuid'] || '');
      const groupType = String(target['groupType'] || 'BENEFICIARY').toUpperCase();
      const recipientType = groupType.startsWith('STAKEHOLDER') ? 'STAKEHOLDER' : 'BENEFICIARY';
      const sessionId = (target['sessionId'] as string) || undefined;
      const error = (target['error'] as string) || undefined;

      const groupName = extractTargetGroupName(target, recipientType);
      const expectedAudience = extractTargetAudience(target);
      const counts = sessionId && sessionCountsMap ? sessionCountsMap.get(sessionId) : null;

      const { status, delivered, failed, pending, total } = resolveTargetCountsAndStatus(
        String(target['status'] || 'IN_PROGRESS'),
        counts,
        expectedAudience,
      );

      rows.push({
        id: `comm-${commUuid}-${targetUuid}`,
        date,
        projectId: proj.uuid,
        projectName: proj.name,
        title,
        channel,
        transportName,
        groupName,
        recipientType,
        status,
        delivered,
        failed,
        pending,
        total,
        sessionId,
        communicationId: commUuid,
        subject: subject?.trim() || undefined,
        message,
        failReason: error,
      });
    }
  }

  return rows;
}



export async function resolveCommRowsWithBroadcastCounts(
  rows: CommunicationActivityItem[],
  newCommunicationService?: {
    session?: {
      broadcastCount: (args: { sessions: string[] }) => Promise<any>;
    };
  },
): Promise<void> {
  if (!newCommunicationService?.session || !rows.length) return;

  const sessionIds = Array.from(
    new Set(rows.map((r) => r.sessionId).filter(Boolean) as string[]),
  );
  if (!sessionIds.length) return;

  const sessionCountsMap = new Map<string, BroadcastCounts>();
  const CHUNK_SIZE = 15;

  for (let i = 0; i < sessionIds.length; i += CHUNK_SIZE) {
    const chunk = sessionIds.slice(i, i + CHUNK_SIZE);
    await Promise.allSettled(
      chunk.map(async (sessionId) => {
        try {
          const res = await newCommunicationService.session!.broadcastCount({
            sessions: [sessionId],
          });
          const counts = res?.data as BroadcastCounts | undefined;
          if (counts) sessionCountsMap.set(sessionId, counts);
        } catch {
          // Graceful fallback to existing status
        }
      }),
    );
  }

  for (const row of rows) {
    if (!row.sessionId) continue;
    const counts = sessionCountsMap.get(row.sessionId);
    if (!counts || counts.TOTAL === undefined) continue;

    const { status, delivered, failed, pending, total } = resolveTargetCountsAndStatus(
      row.status,
      counts,
      row.total || 1,
    );

    row.status = status;
    row.delivered = delivered;
    row.failed = failed;
    row.pending = pending;
    row.total = total;
  }
}

export function filterCommunicationActivities(
  activities: CommunicationActivityItem[],
  params?: CommunicationLogsFilterParams,
): CommunicationActivityItem[] {
  if (!activities.length || !params) return activities.length ? activities : EMPTY_ACTIVITIES;

  const statusFilter = params.status && params.status !== 'all' ? params.status.toUpperCase() : '';
  const isPendingFilter = statusFilter === 'IN_PROGRESS' || statusFilter === 'PENDING';
  const channelFilter = params.channel && params.channel !== 'all' ? classifyTransportString(params.channel) : '';
  const recipientFilter = params.recipient && params.recipient !== 'all' ? params.recipient.toUpperCase() : '';
  const phaseFilter = params.phase && params.phase !== 'all' ? params.phase.toUpperCase() : '';
  const fromTime = params.from ? Date.parse(`${params.from}T00:00:00`) : NaN;
  const toTime = params.to ? Date.parse(`${params.to}T23:59:59.999`) : NaN;
  const searchQuery = params.search?.toLowerCase().trim() || '';

  const hasAnyFilter =
    statusFilter ||
    channelFilter ||
    recipientFilter ||
    phaseFilter ||
    !isNaN(fromTime) ||
    !isNaN(toTime) ||
    searchQuery;

  if (!hasAnyFilter) return activities;

  return activities.filter((r) => {
    if (statusFilter) {
      if (isPendingFilter) {
        if (r.status !== 'IN_PROGRESS') return false;
      } else if (r.status !== statusFilter) return false;
    }

    if (channelFilter && classifyTransportString(r.channel) !== channelFilter) return false;

    if (recipientFilter && (r.recipientType || '').toUpperCase() !== recipientFilter) return false;

    if (phaseFilter && r.phase?.toUpperCase() !== phaseFilter) return false;

    if (!isNaN(fromTime) || !isNaN(toTime)) {
      const t = Date.parse(r.date);
      if (!isNaN(fromTime) && !isNaN(t) && t < fromTime) return false;
      if (!isNaN(toTime) && !isNaN(t) && t > toTime) return false;
    }

    if (searchQuery) {
      const match = [
        r.title,
        r.projectName,
        r.groupName,
        r.channel,
        r.transportName,
        r.phase,
        r.recipientType,
      ].some((field) => field && field.toLowerCase().includes(searchQuery));
      if (!match) return false;
    }

    return true;
  });
}
