import type { DateRange } from 'react-day-picker';
import type { PayoutTransactionStatus } from 'apps/rahat-ui/src/utils/get-status-bg';

// ---------------------------------------------------------------------------
// Event — carries the REAL status and exact second-accurate timestamp.
// ---------------------------------------------------------------------------

export type TimelineEvent = {
  id: string;
  wallet: string;
  txHash: string;
  beneficiaryName?: string;
  /** The raw status string from the API / Excel export. */
  rawStatus: string;
  /** The resolved canonical PayoutTransactionStatus key. */
  status: PayoutTransactionStatus;
  amount: number;
  timestamp: number;
  dateStr: string;
};

// ---------------------------------------------------------------------------
// Zoom / Window ranges matching the reference UI.
// ---------------------------------------------------------------------------

export type TimelineRangeType = '10m' | '30m' | '1h' | '6h' | '24h' | 'all';

// ---------------------------------------------------------------------------
// Per-status bucket for chart aggregation.
// ---------------------------------------------------------------------------

export type TimelineBucket = {
  timestamp: number;
  total: number;
  counts: Record<string, number>;
  amount: number;
  exactTimeDisplay?: string;
};

// ---------------------------------------------------------------------------
// Series Data for the Spline Area Chart.
// ---------------------------------------------------------------------------

export type SeriesData = {
  /** "All Transactions" overall series [timestamp, count]. */
  total: [number, number][];
  /** One series per status key that has data [timestamp, count]. */
  perStatus: Record<string, [number, number][]>;
  /** Map of bucket timestamp -> formatted exact timestamp string for tooltip */
  exactTimes?: Record<number, string>;
};

// ---------------------------------------------------------------------------
// Counts — total + per-status.
// ---------------------------------------------------------------------------

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
  /** All status keys that appear in the data (ordered canonically for legend). */
  activeStatuses: string[];
  /** Status keys ordered for chart layer rendering (largest area in back, smallest on top). */
  chartStatuses: string[];
  totalAmount: number;
  totalTransactions: number;
  maxY: number;
  minTime: number;
  maxTime: number;
  xLabelPattern: string;
  isLargeDataset: boolean;
  /** Full date and time window (e.g. "Sep 25, 2026 • 05:57:12 PM – Sep 26, 2026 • 12:07:32 PM (18h 10m)") */
  timeWindowText: string;
  /** Human-readable duration (e.g. "18h 10m") */
  durationText: string;
  /** Suggested default zoom range based on data span */
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
