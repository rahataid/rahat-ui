import { Project } from '@rahataid/sdk/project/project.types';
import {
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

export function normalizeCommunicationStatus(raw?: string | null): string {
  if (!raw) return 'NOT_STARTED';
  const trimmed = String(raw).trim();
  if (!trimmed) return 'NOT_STARTED';

  const upper = trimmed.toUpperCase().replace(/\s+/g, '_');

  if (upper === 'COMPLETED' || upper === 'SUCCESS' || upper === 'DELIVERED') return 'COMPLETED';
  if (upper === 'SENT') return 'SENT';
  if (upper === 'PENDING' || upper === 'QUEUED') return 'PENDING';
  if (upper === 'NOT_STARTED' || upper === 'NOTSTARTED' || upper === 'NULL') return 'NOT_STARTED';
  if (upper === 'IN_PROGRESS' || upper === 'WORK_IN_PROGRESS' || upper === 'PROCESSING') return 'IN_PROGRESS';
  if (upper === 'FAILED' || upper === 'FAIL' || upper === 'FAILURE') return 'FAILED';
  if (upper === 'CANCELLED' || upper === 'CANCELED') return 'CANCELLED';
  if (upper === 'SCHEDULED') return 'SCHEDULED';

  return upper;
}

export const normalizeSessionStatus = normalizeCommunicationStatus;

function toSafeCount(val: unknown): number {
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

export function parseRowDeliveryMetrics(
  status: string,
  counts: Record<string, unknown> | null | undefined,
  fallbackAudience: number,
): { delivered: number; failed: number; pending: number; total: number } {
  const totalExpected = fallbackAudience > 0 ? fallbackAudience : 1;
  if (counts && typeof counts === 'object') {
    const delivered = toSafeCount(counts['SUCCESS'] ?? counts['success']);
    const failed = toSafeCount(counts['FAIL'] ?? counts['fail']);
    const recordedPending =
      toSafeCount(counts['PENDING'] ?? counts['pending']) +
      toSafeCount(counts['SCHEDULED'] ?? counts['scheduled']);
    const broadcastTotal = toSafeCount(counts['TOTAL'] ?? counts['total']);
    const total =
      broadcastTotal > 0
        ? broadcastTotal
        : delivered + failed + recordedPending;

    const pending =
      total > delivered + failed
        ? Math.max(recordedPending, total - delivered - failed)
        : recordedPending;

    const finalTotal = Math.max(total, delivered + failed + pending);

    return {
      delivered,
      failed,
      pending,
      total: finalTotal,
    };
  }

  const delivered = status === 'COMPLETED' || status === 'SENT' ? totalExpected : 0;
  const failed = status === 'FAILED' ? totalExpected : 0;
  const pending = Math.max(0, totalExpected - delivered - failed);

  return {
    delivered,
    failed,
    pending,
    total: totalExpected,
  };
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
    const ch = classifyTransportString(item.channel || 'SMS');

    const total = Math.max(0, typeof item.total === 'number' ? item.total : 0);
    const delivered = Math.min(
      total,
      Math.max(
        0,
        typeof item.delivered === 'number'
          ? item.delivered
          : item.status === 'COMPLETED' || item.status === 'SENT'
            ? total
            : 0,
      ),
    );
    const failed = Math.min(
      total - delivered,
      Math.max(
        0,
        typeof item.failed === 'number'
          ? item.failed
          : item.status === 'FAILED'
            ? total - delivered
            : 0,
      ),
    );
    const pending = Math.max(0, total - delivered - failed);

    if (item.targetBreakdown) {
      if (item.targetBreakdown.beneficiary) {
        const b = item.targetBreakdown.beneficiary;
        recipientWise.beneficiary.total += b.total;
        recipientWise.beneficiary.successful += b.delivered;
        recipientWise.beneficiary.failed += b.failed;
        recipientWise.beneficiary.pending += b.pending;
      }
      if (item.targetBreakdown.stakeholder) {
        const s = item.targetBreakdown.stakeholder;
        recipientWise.stakeholder.total += s.total;
        recipientWise.stakeholder.successful += s.delivered;
        recipientWise.stakeholder.failed += s.failed;
        recipientWise.stakeholder.pending += s.pending;
      }
    } else {
      const isBen = (item.recipientType || '').toUpperCase().includes('BENEFICIARY');
      const groupKey = isBen ? 'beneficiary' : 'stakeholder';
      recipientWise[groupKey].total += total;
      recipientWise[groupKey].successful += delivered;
      recipientWise[groupKey].failed += failed;
      recipientWise[groupKey].pending += pending;
    }

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
      : 0;

  return {
    overall: {
      totalCommunications: totalComms,
      successful: successfulRecipients,
      failed: failedRecipients,
      pending: pendingRecipients,
      totalRecipients: totalRecipientsCount,
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

export function extractPhase(act?: Record<string, unknown>): string | undefined {
  if (!act) return undefined;
  const phase = act['phase'];
  if (phase && typeof phase === 'object') {
    const name = (phase as Record<string, unknown>)['name'];
    if (typeof name === 'string' && name.trim() && name.trim().toUpperCase() !== 'N/A') {
      return name.trim();
    }
  }
  if (typeof phase === 'string' && phase.trim() && phase.trim().toUpperCase() !== 'N/A') {
    return phase.trim();
  }
  if (typeof act['phaseName'] === 'string' && act['phaseName'].trim() && act['phaseName'].trim().toUpperCase() !== 'N/A') {
    return act['phaseName'].trim();
  }
  return undefined;
}

export function extractSessionId(
  ...sources: (Record<string, unknown> | null | undefined)[]
): string {
  for (const src of sources) {
    if (!src || typeof src !== 'object') continue;
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
      const actStatus = normalizeCommunicationStatus(
        String(act['commStatus'] || act['status'] || 'NOT_STARTED'),
      );
      const { channel, transportName } = resolveTransportInfo(act, transports);
      const sId = extractSessionId(act);
      const actId = String(act['uuid'] || act['id'] || '').trim();
      const { delivered, failed, pending, total } = parseRowDeliveryMetrics(
        actStatus,
        act['counts'] as Record<string, unknown> | undefined,
        1,
      );

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
        phase: extractPhase(act) || 'N/A',
        status: actStatus,
        delivered,
        failed,
        pending,
        total,
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

      const rawStatus = hasExplicitFailure
        ? 'FAILED'
        : String(
            c['sessionStatus'] ??
            c['status'] ??
            c['deliveryStatus'] ??
            act['commStatus'] ??
            act['status'] ??
            'NOT_STARTED',
          );

      const status = normalizeCommunicationStatus(rawStatus);
      const sId = extractSessionId(c, act);
      const expectedAudience =
        extractTargetAudience(c) ||
        Number(c['totalRecipients'] ?? c['total'] ?? c['recipientCount'] ?? 1);
      const total = expectedAudience > 0 ? expectedAudience : 1;

      const actId = String(act['uuid'] || act['id'] || '').trim();
      const commId = String(c['communicationId'] || c['id'] || '').trim();
      const msg = c['message'];
      const phaseName = extractPhase(c) || extractPhase(act) || 'N/A';

      const failReason = extractErrorMessage(
        c['failReason'],
        c['errorMessage'],
        c['error'],
        act['errorMessage'],
        act['failReason'],
      );

      const subject =
        typeof c['subject'] === 'string' && c['subject'].trim()
          ? c['subject'].trim()
          : undefined;

      const { delivered, failed, pending, total: rowTotal } = parseRowDeliveryMetrics(
        status,
        c['counts'] as Record<string, unknown> | undefined,
        total,
      );

      rows.push({
        id: `${actId}-${sId || commId || idx}`,
        date: String(act['createdAt'] || new Date().toISOString()),
        projectId: proj.uuid,
        projectName: proj.name,
        title: String(c['communicationTitle'] || act['title'] || c['groupName'] || 'Communication'),
        channel,
        transportName,
        groupName: String(
          c['groupName'] ||
          (groupType === 'BENEFICIARY' ? 'Beneficiaries' : 'Stakeholders'),
        ),
        recipientType: groupType,
        phase: phaseName,
        status,
        delivered,
        failed,
        pending,
        total: rowTotal,
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
      const hasExplicitFailure =
        Boolean(comm['isFailed']) ||
        Boolean(comm['hasFailed']) ||
        Boolean(comm['error']) ||
        comm['status'] === 'FAILED';

      const rawStatus = hasExplicitFailure
        ? 'FAILED'
        : !sessionId && comm['status'] === 'PENDING'
          ? 'NOT_STARTED'
          : String(
              comm['sessionStatus'] ??
              comm['status'] ??
              comm['deliveryStatus'] ??
              'NOT_STARTED',
            );
      const status = normalizeCommunicationStatus(rawStatus);
      const { delivered, failed, pending, total } = parseRowDeliveryMetrics(
        status,
        comm['counts'] as Record<string, unknown> | undefined,
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
        phase: extractPhase(comm as Record<string, unknown>) || 'N/A',
        status,
        delivered,
        failed,
        pending,
        total,
        sessionId: sessionId || undefined,
        communicationId: commUuid,
        subject: subject?.trim() || undefined,
        message,
        failReason: comm['error'] as string | undefined,
      });
      continue;
    }

    // Aggregate multi-group campaign targets into exactly 1 row per communication campaign
    const groupTypes = new Set<string>();
    const groupNamesSet = new Set<string>();
    let totalDelivered = 0;
    let totalFailed = 0;
    let totalPending = 0;
    let totalAudience = 0;
    let firstSessionId: string | undefined = undefined;
    let firstError: string | undefined = undefined;

    const targetBreakdown: {
      beneficiary?: { delivered: number; failed: number; pending: number; total: number };
      stakeholder?: { delivered: number; failed: number; pending: number; total: number };
    } = {};

    for (const target of targets) {
      const groupType = String(target['groupType'] || 'BENEFICIARY').toUpperCase();
      const isStk = groupType.startsWith('STAKEHOLDER');
      const normalizedGroup = isStk ? 'STAKEHOLDER' : 'BENEFICIARY';
      groupTypes.add(normalizedGroup);

      const targetGroupName = extractTargetGroupName(target, normalizedGroup);
      if (targetGroupName) groupNamesSet.add(targetGroupName);

      const sId = (target['sessionId'] as string) || undefined;
      if (sId && !firstSessionId) firstSessionId = sId;

      const err = (target['error'] as string) || undefined;
      if (err && !firstError) firstError = err;

      const expectedAudience = extractTargetAudience(target);
      const targetAudienceCount = expectedAudience > 0 ? expectedAudience : 1;

      const targetHasFailure =
        Boolean(target['isFailed']) ||
        Boolean(target['hasFailed']) ||
        Boolean(err) ||
        target['status'] === 'FAILED' ||
        comm['status'] === 'FAILED';

      const rawStatus = targetHasFailure
        ? 'FAILED'
        : !sId && (target['status'] === 'PENDING' || comm['status'] === 'PENDING')
          ? 'NOT_STARTED'
          : String(
              target['sessionStatus'] ??
              target['status'] ??
              target['deliveryStatus'] ??
              comm['sessionStatus'] ??
              comm['status'] ??
              'NOT_STARTED',
            );

      const status = normalizeCommunicationStatus(rawStatus);
      const m = parseRowDeliveryMetrics(
        status,
        target['counts'] as Record<string, unknown> | undefined,
        targetAudienceCount,
      );

      totalDelivered += m.delivered;
      totalFailed += m.failed;
      totalPending += m.pending;
      totalAudience += m.total;

      const breakdownKey = isStk ? 'stakeholder' : 'beneficiary';
      if (!targetBreakdown[breakdownKey]) {
        targetBreakdown[breakdownKey] = { delivered: 0, failed: 0, pending: 0, total: 0 };
      }
      targetBreakdown[breakdownKey]!.delivered += m.delivered;
      targetBreakdown[breakdownKey]!.failed += m.failed;
      targetBreakdown[breakdownKey]!.pending += m.pending;
      targetBreakdown[breakdownKey]!.total += m.total;
    }

    let aggregatedStatus: DeliveryStatus;
    if (totalAudience === 0) {
      aggregatedStatus = normalizeCommunicationStatus(
        (comm['sessionStatus'] ?? comm['status'] ?? 'NOT_STARTED') as string,
      );
    } else if (totalPending > 0) {
      aggregatedStatus = firstSessionId ? 'IN_PROGRESS' : 'PENDING';
    } else if (totalDelivered > 0) {
      aggregatedStatus = 'COMPLETED';
    } else if (totalFailed > 0) {
      aggregatedStatus = 'FAILED';
    } else {
      aggregatedStatus = normalizeCommunicationStatus(
        (comm['status'] ?? 'NOT_STARTED') as string,
      );
    }

    const recipientType =
      groupTypes.has('BENEFICIARY') && groupTypes.has('STAKEHOLDER')
        ? 'BENEFICIARY, STAKEHOLDER'
        : groupTypes.has('STAKEHOLDER')
          ? 'STAKEHOLDER'
          : 'BENEFICIARY';

    const groupName = Array.from(groupNamesSet).join(', ') || 'General';

    const phase =
      extractPhase(comm as Record<string, unknown>) ||
      targets.map((t) => extractPhase(t)).find(Boolean) ||
      'N/A';

    rows.push({
      id: `comm-${commUuid}`,
      date,
      projectId: proj.uuid,
      projectName: proj.name,
      title,
      channel,
      transportName,
      groupName,
      recipientType,
      phase,
      status: aggregatedStatus,
      delivered: totalDelivered,
      failed: totalFailed,
      pending: totalPending,
      total: totalAudience,
      sessionId: firstSessionId || extractSessionId(comm) || undefined,
      communicationId: commUuid,
      subject: subject?.trim() || undefined,
      message,
      failReason: firstError || (comm['error'] as string | undefined),
      targetBreakdown,
    });
  }

  return rows;
}

export function filterCommunicationActivities(
  activities: CommunicationActivityItem[],
  params?: CommunicationLogsFilterParams,
): CommunicationActivityItem[] {
  if (!activities.length || !params) return activities.length ? activities : EMPTY_ACTIVITIES;

  const statusFilter = params.status && params.status !== 'all' ? params.status.toUpperCase() : '';
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
      const rowNorm = (r.status || '').toUpperCase();
      if (statusFilter === 'COMPLETED') {
        if (
          rowNorm !== 'COMPLETED' &&
          rowNorm !== 'SUCCESS' &&
          rowNorm !== 'DELIVERED' &&
          rowNorm !== 'SENT'
        ) {
          return false;
        }
      } else if (statusFilter === 'FAILED') {
        if (rowNorm !== 'FAILED' && rowNorm !== 'FAIL' && rowNorm !== 'FAILURE') return false;
      } else if (statusFilter === 'IN_PROGRESS') {
        if (rowNorm === 'COMPLETED' || rowNorm === 'FAILED' || rowNorm === 'CANCELLED') {
          return false;
        }
      } else if (rowNorm !== statusFilter) {
        return false;
      }
    }

    if (
      channelFilter &&
      r.channel !== channelFilter &&
      classifyTransportString(r.channel) !== channelFilter
    ) {
      return false;
    }

    if (recipientFilter) {
      const rType = (r.recipientType || '').toUpperCase();
      if (!rType.includes(recipientFilter)) return false;
    }

    if (phaseFilter && (r.phase || '').toUpperCase() !== phaseFilter) return false;

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
