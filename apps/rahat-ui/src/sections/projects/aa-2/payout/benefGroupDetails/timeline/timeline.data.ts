import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import {
  normalizeStatusKey,
  resolveStatusKey,
  resolveStatusMeta,
  sortStatusesCanonically,
  getStatusCategory,
} from './timeline.status';
import type {
  BucketDetail,
  CategoryCounts,
  CategoryKey,
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

const CATEGORY_MAP: Record<string, CategoryKey> = {
  completed: 'success',
  pending: 'inProgress',
  failed: 'failed',
};

export const toCategory = (status: string): CategoryKey =>
  CATEGORY_MAP[getStatusCategory(status)] ?? 'inProgress';

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

const CATEGORIES: CategoryKey[] = ['success', 'inProgress', 'failed'];

const emptyDetail = (): BucketDetail => ({
  success: {},
  inProgress: {},
  failed: {},
});

const EMPTY_SERIES: TimelineSeriesResult = {
  seriesData: {
    xLabels: [],
    perCategory: { success: [], inProgress: [], failed: [] },
    bucketDetails: [],
    exactTimes: [],
    bucketTimestamps: [],
  },
  activeStatuses: [],
  chartStatuses: [],
  categoryCounts: { success: 0, inProgress: 0, failed: 0 },
  totalAmount: 0,
  totalTransactions: 0,
  maxY: 4,
  minTime: 0,
  maxTime: 0,
  stepMs: 60_000,
  xLabelPattern: 'hh:mm:ss a',
  isLargeDataset: false,
  isSparse: false,
  timeWindowText: '',
  durationText: '',
  defaultRange: 'all',
};

const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

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

  const activeStatuses = sortStatusesCanonically(Array.from(statusSet));
  const chartStatuses = [...activeStatuses].sort(
    (a, b) => (statusTotalMap[b] || 0) - (statusTotalMap[a] || 0),
  );

  let totalDisbursed = 0;
  const categoryCounts: CategoryCounts = { success: 0, inProgress: 0, failed: 0 };

  ascEvents.forEach((ev) => {
    const isDisbursed = isFsp
      ? ev.status === 'FIAT_TRANSACTION_COMPLETED' || ev.status === 'COMPLETED'
      : ev.status === 'COMPLETED' || ev.status === 'PARTIALLY_COMPLETED';
    if (isDisbursed) totalDisbursed += ev.amount;
    categoryCounts[toCategory(ev.status)] += 1;
  });

  const pad = Math.max(MINUTE, Math.floor(dataSpanMs * 0.05));
  const windowStart = dataMinT - pad;
  const windowEnd = dataMaxT + pad;
  const activeSpanMs = Math.max(MINUTE, windowEnd - windowStart);

  const MAX_BUCKETS = 80;

  const uniqueSeconds = new Set(
    ascEvents.map((ev) => Math.floor(ev.timestamp / SECOND) * SECOND),
  );
  const useExactSeconds = uniqueSeconds.size <= MAX_BUCKETS;

  let stepMs: number;
  if (useExactSeconds) {
    stepMs = SECOND;
  } else if (activeSpanMs <= 2 * MINUTE) {
    stepMs = 5 * SECOND;
  } else if (activeSpanMs <= 15 * MINUTE) {
    stepMs = MINUTE;
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
  } else if (activeSpanMs <= 90 * DAY) {
    stepMs = 1 * DAY;
  } else if (activeSpanMs <= 365 * DAY) {
    stepMs = 7 * DAY;
  } else {
    stepMs = 30 * DAY;
  }

  if (!useExactSeconds) {
    while (activeSpanMs / stepMs > MAX_BUCKETS) {
      stepMs *= 2;
    }
    const minStep = activeSpanMs <= 60 * SECOND ? SECOND : 5 * SECOND;
    while (activeSpanMs / stepMs < 8 && stepMs > minStep) {
      stepMs = Math.max(minStep, Math.floor(stepMs / 2));
    }
  }

  type BucketData = {
    catCounts: Record<CategoryKey, number>;
    detail: BucketDetail;
    exactTimestamps: number[];
  };

  const bucketMap = new Map<number, BucketData>();

  ascEvents.forEach((ev) => {
    const bKey = Math.floor(ev.timestamp / stepMs) * stepMs;
    let b = bucketMap.get(bKey);
    if (!b) {
      b = {
        catCounts: { success: 0, inProgress: 0, failed: 0 },
        detail: emptyDetail(),
        exactTimestamps: [],
      };
      bucketMap.set(bKey, b);
    }
    const cat = toCategory(ev.status);
    b.catCounts[cat] += 1;
    b.detail[cat][ev.status] = (b.detail[cat][ev.status] || 0) + 1;
    b.exactTimestamps.push(ev.timestamp);
  });

  const sortedBucketKeys = Array.from(bucketMap.keys()).sort((a, b) => a - b);

  const xLabels: string[] = [];
  const perCategory: Record<CategoryKey, number[]> = {
    success: [],
    inProgress: [],
    failed: [],
  };
  const bucketDetailsArr: BucketDetail[] = [];
  const exactTimesArr: string[] = [];
  const bucketTimestamps: number[] = [];
  let maxY = 0;

  const isSameDay = isSameLocalDay(dataMinT, dataMaxT);

  const xLabelPattern =
    useExactSeconds || activeSpanMs <= 15 * MINUTE
      ? 'hh:mm:ss a'
      : isSameDay
        ? 'hh:mm a'
        : activeSpanMs <= 7 * DAY
          ? 'MMM d, hh:mm a'
          : 'MMM d, yyyy';

  for (const t of sortedBucketKeys) {
    const b = bucketMap.get(t)!;
    const total = b.catCounts.success + b.catCounts.inProgress + b.catCounts.failed;
    if (total === 0) continue;

    if (total > maxY) maxY = total;

    xLabels.push(formatChartDate(t, xLabelPattern, locale));
    bucketTimestamps.push(t);

    CATEGORIES.forEach((cat) => {
      perCategory[cat].push(b.catCounts[cat] || 0);
    });

    bucketDetailsArr.push(b.detail);

    if (b.exactTimestamps.length > 0) {
      const firstTs = b.exactTimestamps[0];
      const lastTs = b.exactTimestamps[b.exactTimestamps.length - 1];
      if (firstTs === lastTs || lastTs - firstTs < 1000) {
        exactTimesArr.push(formatChartDate(firstTs, 'PPp', locale));
      } else {
        const startStr = formatChartDate(firstTs, 'hh:mm:ss a', locale);
        const endStr = formatChartDate(lastTs, 'hh:mm:ss a', locale);
        const startDateStr = formatChartDate(firstTs, 'MMM d, yyyy', locale);
        if (isSameLocalDay(firstTs, lastTs)) {
          exactTimesArr.push(`${startDateStr} • ${startStr} – ${endStr}`);
        } else {
          const endDateStr = formatChartDate(lastTs, 'MMM d, yyyy', locale);
          exactTimesArr.push(`${startDateStr}, ${startStr} – ${endDateStr}, ${endStr}`);
        }
      }
    } else {
      exactTimesArr.push(formatChartDate(t, 'PPp', locale));
    }
  }

  let defaultRange: TimelineRangeType = 'all';
  if (dataSpanMs <= 15 * MINUTE) defaultRange = '10m';
  else if (dataSpanMs <= 45 * MINUTE) defaultRange = '30m';
  else if (dataSpanMs <= 2 * HOUR) defaultRange = '1h';
  else if (dataSpanMs <= 8 * HOUR) defaultRange = '6h';
  else if (dataSpanMs <= 24 * HOUR) defaultRange = '24h';

  const startDateStr = formatChartDate(dataMinT, 'MMM d, yyyy', locale);
  const startTimeStr = formatChartDate(dataMinT, 'hh:mm:ss a', locale);
  const endDateStr = formatChartDate(dataMaxT, 'MMM d, yyyy', locale);
  const endTimeStr = formatChartDate(dataMaxT, 'hh:mm:ss a', locale);

  const timeWindowText = isSameDay
    ? `${startDateStr} • ${startTimeStr} – ${endTimeStr}`
    : `${startDateStr}, ${startTimeStr} – ${endDateStr}, ${endTimeStr}`;

  const durationText = formatDuration(dataMinT, dataMaxT);

  return {
    seriesData: {
      xLabels,
      perCategory,
      bucketDetails: bucketDetailsArr,
      exactTimes: exactTimesArr,
      bucketTimestamps,
    },
    activeStatuses,
    chartStatuses,
    categoryCounts,
    totalAmount: totalDisbursed,
    totalTransactions: filteredEvents.length,
    maxY,
    minTime: dataMinT,
    maxTime: dataMaxT,
    stepMs,
    xLabelPattern,
    isLargeDataset: filteredEvents.length > 500,
    isSparse: false,
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
