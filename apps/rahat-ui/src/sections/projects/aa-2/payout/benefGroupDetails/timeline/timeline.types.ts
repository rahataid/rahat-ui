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

export type SeriesData = {
  total: [number, number][];
  perStatus: Record<string, [number, number][]>;
  exactTimes?: Record<number, string>;
};

export type StatusCounts = {
  total: number;
  perStatus: Record<string, number>;
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
  totalAmount: number;
  totalTransactions: number;
  maxY: number;
  minTime: number;
  maxTime: number;
  xLabelPattern: string;
  isLargeDataset: boolean;
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
