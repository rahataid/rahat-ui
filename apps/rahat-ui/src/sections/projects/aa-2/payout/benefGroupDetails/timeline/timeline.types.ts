import type { DateRange } from 'react-day-picker';
import type { PayoutTransactionStatus } from 'apps/rahat-ui/src/utils/get-status-bg';

export type TimelineEvent = {
  id: string;
  wallet: string;
  txHash: string;
  beneficiaryName?: string;
  rawStatus: string;
  status: PayoutTransactionStatus;
  amount: number;
  timestamp: number;
  dateStr: string;
};

export type TimelineRangeType = '10m' | '30m' | '1h' | '6h' | '24h' | 'all';

export type TimelineBucket = {
  timestamp: number;
  total: number;
  counts: Record<string, number>;
  amount: number;
  exactTimeDisplay?: string;
};

export type CategoryKey = 'success' | 'inProgress' | 'failed';

export type BucketDetail = {
  [cat in CategoryKey]: Record<string, number>;
};

export type SeriesData = {
  xLabels: string[];
  perCategory: Record<CategoryKey, number[]>;
  bucketDetails: BucketDetail[];
  exactTimes: string[];
  bucketTimestamps: number[];
};

export type StatusCounts = {
  total: number;
  perStatus: Record<string, number>;
};

export type CategoryCounts = {
  success: number;
  inProgress: number;
  failed: number;
};

export type TimelineDateRange = DateRange;

export type TimelineFilters = {
  searchQuery: string;
  status: string;
  dateRange?: TimelineDateRange;
};

export type TimelineSeriesResult = {
  seriesData: SeriesData;
  activeStatuses: string[];
  chartStatuses: string[];
  categoryCounts: CategoryCounts;
  totalAmount: number;
  totalTransactions: number;
  maxY: number;
  minTime: number;
  maxTime: number;
  stepMs: number;
  xLabelPattern: string;
  isLargeDataset: boolean;
  isSparse: boolean;
  timeWindowText: string;
  durationText: string;
  defaultRange: TimelineRangeType;
};

export type TimelineChartLabels = {
  title: string;
  subtitle: string;
  allTransactions: string;
  total: string;
  txns: string;
  disbursed: string;
  zoomIn: string;
  zoomOut: string;
  pan: string;
  reset: string;
};

export type FormatNumRef = { current: (value: number) => string };
