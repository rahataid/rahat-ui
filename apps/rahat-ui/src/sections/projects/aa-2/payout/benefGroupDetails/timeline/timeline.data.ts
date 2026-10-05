import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import {
  normalizeStatusKey,
  resolveStatusKey,
  resolveStatusMeta,
  sortStatusesCanonically,
} from './timeline.status';
import type {
  StatusCounts,
  TimelineEvent,
  TimelineFilters,
  TimelineRangeType,
  TimelineSeriesResult,
} from './timeline.types';
import {
  endOfDay,
  formatChartDate,
  formatDuration,
  isSameLocalDay,
  parseNumeric,
  startOfDay,
  toEpochMs,
} from './timeline.utils';

type NormalizeResult = { events: TimelineEvent[]; undatedCount: number };

/**
 * Normalizes log rows from both API responses and Excel exports.
 * Uses second-accurate timestamps based on transaction status:
 * - Completed/Failed/Transitioned rows lead with `updatedAt` (when the milestone actually occurred).
 * - Pending/Initiated rows lead with `createdAt` (when the transaction was initiated).
 * - Fallbacks between updated and created ensure missing or empty dates don't drop valid rows.
 */
export const normalizeTimelineEvents = (
  logs: any[],
  isFsp: boolean,
): NormalizeResult => {
  const events: TimelineEvent[] = [];
  if (!logs?.length) return { events, undatedCount: 0 };

  logs.forEach((item, idx) => {
    const wallet =
      item?.beneficiaryWalletAddress ||
      item?.['Beneficiary Wallet Address'] ||
      item?.walletAddress ||
      item?.wallet ||
      '';
    const txHash =
      item?.txHash ||
      item?.['Transaction Hash'] ||
      item?.['Transaction Wallet ID'] ||
      item?.info?.transactionHash ||
      item?.info?.offrampWalletAddress ||
      '';
    const beneficiaryName =
      item?.beneficiary?.name ||
      item?.['Beneficiary Name'] ||
      item?.beneficiaryName ||
      item?.name ||
      '';

    const rawStatus =
      item?.status || item?.['Payout Status'] || item?.payoutStatus || 'PENDING';

    const status = resolveStatusKey(rawStatus);

    // Amount disbursed: token units from API, or numeric currency from export
    const rawAmount = parseNumeric(item?.amount);
    const amount =
      rawAmount !== null
        ? rawAmount * ONE_TOKEN_VALUE
        : parseNumeric(item?.['Amount Disbursed']) ?? 0;

    const createdRaw =
      item?.createdAt ??
      item?.['Created At'] ??
      item?.timestamp ??
      item?.['Timestamp'] ??
      item?.date ??
      item?.['Date'];

    const updatedRaw =
      item?.updatedAt ??
      item?.['Updated At'] ??
      item?.timestamp ??
      item?.['Timestamp'] ??
      item?.date ??
      item?.['Date'];

    // Milestone completion/failure happened at updatedAt. Initiation happened at createdAt.
    const isTransitioned =
      status !== 'PENDING' &&
      status !== 'TOKEN_TRANSACTION_INITIATED' &&
      status !== 'FIAT_TRANSACTION_INITIATED';

    const updatedTs = toEpochMs(updatedRaw);
    const createdTs = toEpochMs(createdRaw);

    let timestamp: number | null = null;
    let dateStr = '';

    if (isTransitioned) {
      if (updatedTs !== null) {
        timestamp = updatedTs;
        dateStr = String(updatedRaw);
      } else if (createdTs !== null) {
        timestamp = createdTs;
        dateStr = String(createdRaw);
      }
    } else {
      if (createdTs !== null) {
        timestamp = createdTs;
        dateStr = String(createdRaw);
      } else if (updatedTs !== null) {
        timestamp = updatedTs;
        dateStr = String(updatedRaw);
      }
    }

    if (timestamp === null) return;

    events.push({
      id: item?.id || item?.uuid || `${wallet}-${idx}`,
      wallet: String(wallet),
      txHash: String(txHash),
      beneficiaryName: String(beneficiaryName),
      rawStatus: String(rawStatus),
      status,
      amount,
      timestamp,
      dateStr,
    });
  });

  return { events, undatedCount: logs.length - events.length };
};

export const filterTimelineEvents = (
  events: TimelineEvent[],
  { searchQuery, status, dateRange }: TimelineFilters,
): TimelineEvent[] =>
  events.filter((event) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesWallet = event.wallet.toLowerCase().includes(query);
      const matchesHash = event.txHash.toLowerCase().includes(query);
      const matchesName = (event.beneficiaryName || '')
        .toLowerCase()
        .includes(query);
      if (!matchesWallet && !matchesHash && !matchesName) return false;
    }

    // Exact status matching against selected filter option
    if (status && status !== 'ALL') {
      if (normalizeStatusKey(event.status) !== normalizeStatusKey(status)) {
        return false;
      }
    }

    if (dateRange?.from) {
      const fromMs = startOfDay(dateRange.from);
      const toMs = endOfDay(dateRange.to ?? dateRange.from);
      if (event.timestamp < fromMs || event.timestamp > toMs) return false;
    }

    return true;
  });

export const countTimelineEvents = (events: TimelineEvent[]): StatusCounts => {
  const perStatus: Record<string, number> = {};
  events.forEach((event) => {
    perStatus[event.status] = (perStatus[event.status] || 0) + 1;
  });
  return {
    total: events.length,
    perStatus,
  };
};

const EMPTY_SERIES: TimelineSeriesResult = {
  seriesData: {
    total: [],
    perStatus: {},
    exactTimes: {},
  },
  activeStatuses: [],
  chartStatuses: [],
  totalAmount: 0,
  totalTransactions: 0,
  maxY: 4,
  minTime: 0,
  maxTime: 0,
  xLabelPattern: 'hh:mm:ss a',
  isLargeDataset: false,
  timeWindowText: '',
  durationText: '',
  defaultRange: 'all',
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Finds the timestamp with highest transaction density to anchor zoomed views.
 */
const findPeakTimestamp = (events: TimelineEvent[]): number => {
  if (!events.length) return Date.now();
  const densityMap = new Map<number, number>();
  events.forEach((ev) => {
    const key = Math.floor(ev.timestamp / MINUTE) * MINUTE;
    densityMap.set(key, (densityMap.get(key) || 0) + 1);
  });
  let maxCount = -1;
  let peakTime = events[events.length - 1].timestamp;
  densityMap.forEach((count, time) => {
    if (count > maxCount) {
      maxCount = count;
      peakTime = time;
    }
  });
  return peakTime;
};

/**
 * Builds smooth spline Area Series matching the reference UI.
 * Handles exact second timestamps and creates an elegant, continuous curve
 * with clear point markers and proper status handling.
 */
export const buildTimelineSeries = (
  filteredEvents: TimelineEvent[],
  rangeType: TimelineRangeType = 'all',
  locale = 'en',
  isFsp = false,
): TimelineSeriesResult => {
  if (!filteredEvents.length) return EMPTY_SERIES;

  const ascEvents = [...filteredEvents].sort((a, b) => a.timestamp - b.timestamp);

  const dataMinT = ascEvents[0].timestamp;
  const dataMaxT = ascEvents[ascEvents.length - 1].timestamp;
  const dataSpanMs = Math.max(SECOND, dataMaxT - dataMinT);

  const statusSet = new Set<string>();
  const statusTotalMap: Record<string, number> = {};
  ascEvents.forEach((ev) => {
    statusSet.add(ev.status);
    statusTotalMap[ev.status] = (statusTotalMap[ev.status] || 0) + 1;
  });

  // Active statuses in canonical business order (Completed -> In Progress -> Failed/Cancelled) for legend
  const activeStatuses = sortStatusesCanonically(Array.from(statusSet));

  // Chart layer order: render larger area series first (in back) and smaller series on top (in front)
  const chartStatuses = [...activeStatuses].sort(
    (a, b) => (statusTotalMap[b] || 0) - (statusTotalMap[a] || 0),
  );

  let totalDisbursed = 0;
  ascEvents.forEach((ev) => {
    // For FSP: only FIAT_TRANSACTION_COMPLETED or final COMPLETED represents money disbursed to beneficiary.
    // For CVA / Vendor: COMPLETED or PARTIALLY_COMPLETED represents disbursed money.
    const isDisbursed = isFsp
      ? ev.status === 'FIAT_TRANSACTION_COMPLETED' || ev.status === 'COMPLETED'
      : ev.status === 'COMPLETED' || ev.status === 'PARTIALLY_COMPLETED';

    if (isDisbursed) {
      totalDisbursed += ev.amount;
    }
  });

  // -------------------------------------------------------------------------
  // 1. Determine active window based on Range Pill (10m, 30m, 1h, 6h, 24h, all)
  // -------------------------------------------------------------------------
  const peakTime = findPeakTimestamp(ascEvents);

  let windowStart = dataMinT;
  let windowEnd = dataMaxT;

  if (rangeType === '10m') {
    const duration = 10 * MINUTE;
    windowStart = Math.max(dataMinT - MINUTE, peakTime - duration / 2);
    windowEnd = windowStart + duration;
  } else if (rangeType === '30m') {
    const duration = 30 * MINUTE;
    windowStart = Math.max(dataMinT - 2 * MINUTE, peakTime - duration / 2);
    windowEnd = windowStart + duration;
  } else if (rangeType === '1h') {
    const duration = 1 * HOUR;
    windowStart = Math.max(dataMinT - 5 * MINUTE, peakTime - duration / 2);
    windowEnd = windowStart + duration;
  } else if (rangeType === '6h') {
    const duration = 6 * HOUR;
    windowStart = Math.max(dataMinT - 15 * MINUTE, peakTime - duration / 2);
    windowEnd = windowStart + duration;
  } else if (rangeType === '24h') {
    const duration = 24 * HOUR;
    windowStart = dataMinT - 30 * MINUTE;
    windowEnd = windowStart + duration;
  } else {
    // 'all' — pad slightly on both sides so edge markers have breathing room
    const pad = Math.max(MINUTE, Math.floor(dataSpanMs * 0.05));
    windowStart = dataMinT - pad;
    windowEnd = dataMaxT + pad;
  }

  const activeSpanMs = Math.max(MINUTE, windowEnd - windowStart);

  // -------------------------------------------------------------------------
  // 2. Adaptive Step Size for Spline Points (12 to 35 points across width)
  // -------------------------------------------------------------------------
  let stepMs = MINUTE;
  if (activeSpanMs <= 2 * MINUTE) {
    stepMs = 5 * SECOND;
  } else if (activeSpanMs <= 15 * MINUTE) {
    stepMs = MINUTE; // 1-minute steps for 10-15m (exactly like the reference image!)
  } else if (activeSpanMs <= 45 * MINUTE) {
    stepMs = 2 * MINUTE;
  } else if (activeSpanMs <= 2 * HOUR) {
    stepMs = 5 * MINUTE;
  } else if (activeSpanMs <= 6 * HOUR) {
    stepMs = 15 * MINUTE;
  } else if (activeSpanMs <= 24 * HOUR) {
    stepMs = 1 * HOUR;
  } else if (activeSpanMs <= 7 * DAY) {
    stepMs = 3 * HOUR;
  } else {
    stepMs = 1 * DAY;
  }

  // Bound points count between 11 and 45 for optimal smooth spline rendering
  while (activeSpanMs / stepMs > 45) {
    stepMs *= 2;
  }
  while (activeSpanMs / stepMs < 10 && stepMs > 5 * SECOND) {
    stepMs = Math.max(5 * SECOND, Math.floor(stepMs / 2));
  }

  // -------------------------------------------------------------------------
  // 3. Aggregate transactions into time buckets with exact second timestamps
  // -------------------------------------------------------------------------
  type BucketData = {
    total: number;
    counts: Record<string, number>;
    exactTimestamps: number[];
  };

  const bucketMap = new Map<number, BucketData>();

  ascEvents.forEach((ev) => {
    const bKey = Math.floor(ev.timestamp / stepMs) * stepMs;
    let b = bucketMap.get(bKey);
    if (!b) {
      b = { total: 0, counts: {}, exactTimestamps: [] };
      bucketMap.set(bKey, b);
    }
    b.total += 1;
    b.counts[ev.status] = (b.counts[ev.status] || 0) + 1;
    b.exactTimestamps.push(ev.timestamp);
  });

  const firstBucket = Math.floor(windowStart / stepMs) * stepMs;
  const lastBucket = Math.ceil(windowEnd / stepMs) * stepMs;

  const totalSeries: [number, number][] = [];
  const perStatusSeries: Record<string, [number, number][]> = {};
  const exactTimes: Record<number, string> = {};

  activeStatuses.forEach((s) => {
    perStatusSeries[s] = [];
  });

  let maxY = 0;

  for (let t = firstBucket; t <= lastBucket; t += stepMs) {
    const b = bucketMap.get(t);
    const count = b?.total || 0;
    totalSeries.push([t, count]);

    if (count > maxY) maxY = count;

    activeStatuses.forEach((s) => {
      const sCount = b?.counts[s] || 0;
      perStatusSeries[s].push([t, sCount]);
    });

    // Determine exact timestamp string for tooltip
    if (b && b.exactTimestamps.length > 0) {
      const firstTs = b.exactTimestamps[0];
      const lastTs = b.exactTimestamps[b.exactTimestamps.length - 1];
      if (firstTs === lastTs || lastTs - firstTs < 1000) {
        // All events in bucket occurred at the exact same second!
        exactTimes[t] = formatChartDate(firstTs, 'PPp', locale);
      } else {
        const startStr = formatChartDate(firstTs, 'hh:mm:ss a', locale);
        const endStr = formatChartDate(lastTs, 'hh:mm:ss a', locale);
        const dateStr = formatChartDate(firstTs, 'MMM d, yyyy', locale);
        exactTimes[t] = `${dateStr} • ${startStr} – ${endStr}`;
      }
    } else {
      // Empty interval
      exactTimes[t] = formatChartDate(t, 'PPp', locale);
    }
  }

  // -------------------------------------------------------------------------
  // 4. Default range recommendation
  // -------------------------------------------------------------------------
  let defaultRange: TimelineRangeType = 'all';
  if (dataSpanMs <= 15 * MINUTE) {
    defaultRange = '10m';
  } else if (dataSpanMs <= 45 * MINUTE) {
    defaultRange = '30m';
  } else if (dataSpanMs <= 2 * HOUR) {
    defaultRange = '1h';
  } else if (dataSpanMs <= 8 * HOUR) {
    defaultRange = '6h';
  } else if (dataSpanMs <= 24 * HOUR) {
    defaultRange = '24h';
  } else {
    defaultRange = 'all';
  }

  // -------------------------------------------------------------------------
  // 5. Time Window & Duration Text
  // -------------------------------------------------------------------------
  const isSameDay = isSameLocalDay(dataMinT, dataMaxT);
  const startDateStr = formatChartDate(dataMinT, 'MMM d, yyyy', locale);
  const startTimeStr = formatChartDate(dataMinT, 'hh:mm:ss a', locale);
  const endDateStr = formatChartDate(dataMaxT, 'MMM d, yyyy', locale);
  const endTimeStr = formatChartDate(dataMaxT, 'hh:mm:ss a', locale);

  const timeWindowText = isSameDay
    ? `${startDateStr} • ${startTimeStr} – ${endTimeStr}`
    : `${startDateStr}, ${startTimeStr} – ${endDateStr}, ${endTimeStr}`;

  const durationText = formatDuration(dataMinT, dataMaxT);

  // X-axis label pattern matching the view span
  const xLabelPattern =
    activeSpanMs <= 15 * MINUTE
      ? 'hh:mm:ss a' // e.g. "9:00:00 PM" as in reference image!
      : isSameDay
        ? 'hh:mm a'
        : activeSpanMs <= 7 * DAY
          ? 'MMM d, hh:mm a'
          : 'MMM d, yyyy';

  return {
    seriesData: {
      total: totalSeries,
      perStatus: perStatusSeries,
      exactTimes,
    },
    activeStatuses,
    chartStatuses,
    totalAmount: totalDisbursed,
    totalTransactions: filteredEvents.length,
    maxY,
    minTime: firstBucket,
    maxTime: lastBucket,
    xLabelPattern,
    isLargeDataset: filteredEvents.length > 500,
    timeWindowText,
    durationText,
    defaultRange,
  };
};

export const niceYCeiling = (maxY: number): number => {
  if (maxY <= 0) return 4;
  if (maxY <= 3) return maxY + 1;
  const target = maxY * 1.15;
  const mag = Math.pow(10, Math.floor(Math.log10(target)));
  const frac = target / mag;
  const ladder = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const step = ladder.find((s) => frac <= s) ?? 10;
  return Math.max(maxY + 1, Math.ceil(step * mag));
};
