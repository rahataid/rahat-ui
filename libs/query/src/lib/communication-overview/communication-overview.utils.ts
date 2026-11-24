import {
  ChannelWiseStats,
  CommunicationActivityItem,
  CommunicationChannel,
  CommunicationLogsFilterParams,
  CommunicationOverviewData,
  GroupDeliveryStats,
  GroupTransportStats,
  RecipientWiseStats,
} from './communication-overview.types';

export const EMPTY_ACTIVITIES: CommunicationActivityItem[] = [];

const COMPLETED_SET = new Set(['COMPLETED', 'SUCCESS', 'DELIVERED', 'SENT']);
const FAILED_SET = new Set(['FAILED', 'FAIL', 'FAILURE']);
const TERMINAL_SET = new Set(['COMPLETED', 'FAILED', 'CANCELLED']);

export function capitalizeFirstLetter(str?: string | null): string {
  if (!str) return '';
  const trimmed = String(str).trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : '';
}

export function classifyTransportString(raw?: string | null): CommunicationChannel {
  if (!raw) return 'SMS';
  const val = String(raw).trim().toUpperCase();
  if (val.includes('VOICE') || val.includes('IVR')) return 'VOICE';
  if (val.includes('EMAIL') || val.includes('SMTP') || val.includes('SES')) return 'EMAIL';
  if (val.includes('WHATSAPP') || val === 'WA') return 'WHATSAPP';
  return 'SMS';
}

export function emptyGroupStats(): GroupDeliveryStats {
  return { total: 0, successful: 0, failed: 0, pending: 0, successRate: 0 };
}

function applySuccessRate(stats: GroupDeliveryStats) {
  stats.successRate = stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0;
}

export function transformGroupTransportStatsToRecipientWise(
  groupStats?: GroupTransportStats | null,
  channelFilter?: string,
): RecipientWiseStats {
  const result: RecipientWiseStats = {
    beneficiary: emptyGroupStats(),
    stakeholder: emptyGroupStats(),
  };
  if (!groupStats) return result;

  const targetChannel =
    channelFilter && channelFilter !== 'all' ? classifyTransportString(channelFilter) : undefined;

  for (const role of ['beneficiary', 'stakeholder'] as const) {
    const roleTransports = groupStats[role];
    if (!roleTransports || typeof roleTransports !== 'object') continue;

    for (const [transportName, counts] of Object.entries(roleTransports)) {
      if (!counts) continue;
      if (targetChannel && classifyTransportString(transportName) !== targetChannel) continue;

      const s = Number(counts.SUCCESS || 0);
      const f = Number(counts.FAIL || 0);
      const scheduled = Number(counts.SCHEDULED || 0);
      const rawPending = Number(counts.PENDING || 0);
      const rawTotal = Number(counts.TOTAL || 0);

      const computedPending =
        rawPending + scheduled > 0 ? rawPending + scheduled : Math.max(0, rawTotal - (s + f));
      const computedTotal = rawTotal > 0 ? rawTotal : s + f + computedPending;

      result[role].successful += s;
      result[role].failed += f;
      result[role].pending += computedPending;
      result[role].total += computedTotal;
    }

    applySuccessRate(result[role]);
  }

  return result;
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
    const total = Math.max(0, item.total || 0);
    const delivered = Math.min(
      total,
      Math.max(0, typeof item.delivered === 'number' ? item.delivered : COMPLETED_SET.has(item.status) ? total : 0),
    );
    const failed = Math.min(
      total - delivered,
      Math.max(0, typeof item.failed === 'number' ? item.failed : item.status === 'FAILED' ? total - delivered : 0),
    );
    const pending = Math.max(0, total - delivered - failed);

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

  for (const ch of Object.values(channelWise)) applySuccessRate(ch);

  const totalComms = activities.length;
  const overallSuccessRate =
    totalRecipientsCount > 0 ? Math.round((successfulRecipients / totalRecipientsCount) * 100) : 0;

  return {
    overall: {
      totalCommunications: totalComms,
      totalCampaigns: totalComms,
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
  const tokens = params.search?.toLowerCase().trim().split(/\s+/).filter(Boolean) ?? [];

  const hasAnyFilter =
    statusFilter ||
    channelFilter ||
    recipientFilter ||
    phaseFilter ||
    !isNaN(fromTime) ||
    !isNaN(toTime) ||
    tokens.length > 0;

  if (!hasAnyFilter) return activities;

  return activities.filter((r) => {
    if (statusFilter) {
      const rowNorm = (r.status || '').toUpperCase();
      if (statusFilter === 'COMPLETED') {
        if (!COMPLETED_SET.has(rowNorm)) return false;
      } else if (statusFilter === 'FAILED') {
        if (!FAILED_SET.has(rowNorm)) return false;
      } else if (statusFilter === 'IN_PROGRESS') {
        if (TERMINAL_SET.has(rowNorm)) return false;
      } else if (rowNorm !== statusFilter) {
        return false;
      }
    }

    if (channelFilter && r.channel !== channelFilter && classifyTransportString(r.channel) !== channelFilter) {
      return false;
    }

    if (recipientFilter && !(r.recipientType || '').toUpperCase().includes(recipientFilter)) {
      return false;
    }

    if (phaseFilter && (r.phase || '').toUpperCase() !== phaseFilter) {
      return false;
    }

    if (!isNaN(fromTime) || !isNaN(toTime)) {
      const t = Date.parse(r.date);
      if (!isNaN(fromTime) && !isNaN(t) && t < fromTime) return false;
      if (!isNaN(toTime) && !isNaN(t) && t > toTime) return false;
    }

    if (tokens.length > 0) {
      const haystack = `${r.title} ${r.projectName ?? ''} ${r.groupName ?? ''} ${r.channel} ${r.transportName ?? ''} ${r.phase ?? ''} ${r.recipientType} ${r.status} ${r.failReason ?? ''}`.toLowerCase();
      if (!tokens.every((token) => haystack.includes(token))) return false;
    }

    return true;
  });
}
