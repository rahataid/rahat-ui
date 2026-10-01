'use client';

import React, { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { RotateCcw } from 'lucide-react';
import {
  Heading,
  NoResult,
  SearchInput,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { PayoutTransactionStatus } from 'apps/rahat-ui/src/utils/get-status-bg';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

// Same pattern as DHM chart and shadcn Chart wrapper
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ── Chart-specific date formatter (mirrors DHM chart pattern) ────────
const CHART_DATE_PATTERN_MAP: Record<string, Intl.DateTimeFormatOptions> = {
  'hh:mm:ss a': { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true },
  'hh:mm a': { hour: '2-digit', minute: '2-digit', hour12: true },
  'h:mm a': { hour: 'numeric', minute: '2-digit', hour12: true },
  'MMM dd, yyyy, hh:mm a': { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true },
  'MMM dd, yyyy': { month: 'short', day: '2-digit', year: 'numeric' },
  PPp: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true },
};

const formatChartDate = (value: string | number, pattern: string, locale: string) => {
  const options = CHART_DATE_PATTERN_MAP[pattern] ?? CHART_DATE_PATTERN_MAP['h:mm a'];
  const neOptions = locale === 'ne' ? { ...options, numberingSystem: 'deva' as const } : options;
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const formatter = new Intl.DateTimeFormat(
    locale === 'ne' ? 'ne-NP' : locale,
    neOptions,
  );
  if (locale === 'ne' && (options.month)) {
    return localizeNepaliParts(d, options, formatter.formatToParts(d));
  }
  return formatter.format(d);
};

type PayoutTimelineProps = {
  payout?: any;
  logs: any[];
  loading?: boolean;
  projectId?: any;
};

type TimelineEvent = {
  id: string;
  wallet: string;
  txHash: string;
  status: PayoutTransactionStatus;
  amount: number;
  timestamp: number;
  dateStr: string;
};

const STATUS_COMPLETED = ['COMPLETED', 'FIAT_TRANSACTION_COMPLETED', 'TOKEN_TRANSACTION_COMPLETED', 'DISBURSED', 'SUCCESS', 'PAID'];
const STATUS_FAILED = ['FAILED', 'FIAT_TRANSACTION_FAILED', 'TOKEN_TRANSACTION_FAILED', 'REJECTED', 'CANCELLED', 'ERROR'];
const STATUS_PENDING = ['PENDING', 'FIAT_TRANSACTION_INITIATED', 'TOKEN_TRANSACTION_INITIATED', 'INITIATED', 'PROCESSING', 'QUEUED', 'SENDING'];

export default function PayoutTimeline({
  payout,
  logs = [],
  loading = false,
}: PayoutTimelineProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const locale = useLocale();
  const formatDate = useDateFormat();
  const formatNum = useNumberFormat();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>();

  // 1. Normalize all transactions with second-level timestamps
  const normalizedEvents = useMemo<TimelineEvent[]>(() => {
    if (!logs || !logs.length) return [];

    return logs.map((item, idx) => {
      const wallet =
        item.beneficiaryWalletAddress ||
        item['Beneficiary Wallet Address'] ||
        '';
      const txHash =
        item.txHash ||
        item['Transaction Hash'] ||
        item['Transaction Wallet ID'] ||
        item.info?.transactionHash ||
        '';
      const rawStatus =
        item.status || item['Payout Status'] || item.payoutStatus || 'PENDING';

      let amount = 0;
      if (typeof item.amount === 'number') {
        amount = item.amount * ONE_TOKEN_VALUE;
      } else if (typeof item['Amount Disbursed'] === 'number') {
        amount = item['Amount Disbursed'];
      }

      // Respect the settlement timestamp if completed, otherwise initiation timestamp
      const dateRaw =
        (rawStatus === 'COMPLETED' ? item.updatedAt : null) ||
        item.createdAt ||
        item['Created At'] ||
        item.updatedAt ||
        item['Updated At'] ||
        new Date().toISOString();

      const timestamp = new Date(dateRaw).getTime();

      return {
        id: item.id || item.uuid || `${wallet}-${idx}`,
        wallet,
        txHash,
        status: rawStatus as PayoutTransactionStatus,
        amount,
        timestamp: isNaN(timestamp) ? Date.now() : timestamp,
        dateStr: dateRaw,
      };
    });
  }, [logs]);

  // 2. Filter transactions based on search, status, date range
  const filteredEvents = useMemo(() => {
    return normalizedEvents.filter((event) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesWallet = event.wallet.toLowerCase().includes(query);
        const matchesHash = event.txHash.toLowerCase().includes(query);
        if (!matchesWallet && !matchesHash) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        const statusUpper = String(event.status).toUpperCase();
        if (statusFilter === 'COMPLETED') {
          if (!STATUS_COMPLETED.includes(statusUpper)) return false;
        } else if (statusFilter === 'FAILED') {
          if (!STATUS_FAILED.includes(statusUpper)) return false;
        } else if (statusFilter === 'PENDING') {
          if (!STATUS_PENDING.includes(statusUpper)) return false;
        } else if (statusUpper !== statusFilter) {
          return false;
        }
      }

      // Date range filter
      if (dateRange?.from) {
        const eventDate = new Date(event.timestamp);
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);

        if (eventDate < fromDate) return false;

        if (dateRange.to) {
          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          if (eventDate > toDate) return false;
        }
      }

      return true;
    });
  }, [normalizedEvents, searchQuery, statusFilter, dateRange]);

  // 3. Adaptive Time-Series Engine → Handles small precision sets & massive transaction volumes (10,000+ txns)
  const { seriesData, totalAmount, peakPoint, maxY, minTime, maxTime, xLabelPattern, isLargeDataset } = useMemo(() => {
    if (!filteredEvents.length) {
      return { seriesData: { total: [], completed: [] }, totalAmount: 0, peakPoint: null, maxY: 0, minTime: 0, maxTime: 0, xLabelPattern: 'h:mm a', isLargeDataset: false };
    }

    const ascEvents = [...filteredEvents].sort((a, b) => a.timestamp - b.timestamp);

    const minT = ascEvents[0].timestamp;
    const maxT = ascEvents[ascEvents.length - 1].timestamp;
    const spanMs = maxT - minT;

    const SECOND = 1_000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;

    // Step A: Group all events by exact second (100% precise timestamp match with logs table)
    const exactMap = new Map<number, { timestamp: number; total: number; completed: number; pending: number; failed: number; amount: number }>();
    let totalDisbursed = 0;

    ascEvents.forEach((ev) => {
      const exactSecond = Math.floor(ev.timestamp / 1000) * 1000;
      let entry = exactMap.get(exactSecond);
      if (!entry) {
        entry = { timestamp: exactSecond, total: 0, completed: 0, pending: 0, failed: 0, amount: 0 };
        exactMap.set(exactSecond, entry);
      }
      entry.total += 1;
      const st = String(ev.status).toUpperCase();
      if (STATUS_COMPLETED.includes(st)) {
        entry.completed += 1;
        entry.amount += ev.amount;
        totalDisbursed += ev.amount;
      } else if (STATUS_FAILED.includes(st)) {
        entry.failed += 1;
      } else {
        entry.pending += 1;
      }
    });

    const exactPoints = Array.from(exactMap.values()).sort((a, b) => a.timestamp - b.timestamp);

    // Step B: If there are > 400 unique timestamp moments (multi-day/high-frequency logs), downsample for performance
    let displayPoints = exactPoints;
    if (exactPoints.length > 400) {
      const step = Math.ceil(spanMs / 300);
      const bMap = new Map<number, typeof exactPoints[0]>();
      exactPoints.forEach((pt) => {
        const key = Math.floor(pt.timestamp / step) * step;
        let b = bMap.get(key);
        if (!b) {
          b = { timestamp: pt.timestamp, total: 0, completed: 0, pending: 0, failed: 0, amount: 0 };
          bMap.set(key, b);
        }
        b.total += pt.total;
        b.completed += pt.completed;
        b.pending += pt.pending;
        b.failed += pt.failed;
        b.amount += pt.amount;
        if (pt.total > b.total - pt.total) {
          b.timestamp = pt.timestamp;
        }
      });
      displayPoints = Array.from(bMap.values()).sort((a, b) => a.timestamp - b.timestamp);
    }

    // Step C: Build series with smooth zero baselines around active transaction moments
    const totalSeries: [number, number][] = [];
    const completedSeries: [number, number][] = [];

    const BASELINE_GAP = Math.min(Math.max(spanMs / 15, 10 * SECOND), 2 * MINUTE);

    const startTime = displayPoints[0].timestamp - BASELINE_GAP;
    totalSeries.push([startTime, 0]);
    completedSeries.push([startTime, 0]);

    displayPoints.forEach((pt, idx) => {
      if (idx > 0) {
        const prevPt = displayPoints[idx - 1];
        if (pt.timestamp - prevPt.timestamp > 2 * BASELINE_GAP) {
          totalSeries.push([prevPt.timestamp + BASELINE_GAP, 0]);
          completedSeries.push([prevPt.timestamp + BASELINE_GAP, 0]);

          totalSeries.push([pt.timestamp - BASELINE_GAP, 0]);
          completedSeries.push([pt.timestamp - BASELINE_GAP, 0]);
        }
      } else {
        totalSeries.push([pt.timestamp - BASELINE_GAP, 0]);
        completedSeries.push([pt.timestamp - BASELINE_GAP, 0]);
      }

      totalSeries.push([pt.timestamp, pt.total]);
      completedSeries.push([pt.timestamp, pt.completed]);
    });

    const endTime = displayPoints[displayPoints.length - 1].timestamp + BASELINE_GAP;
    totalSeries.push([endTime, 0]);
    completedSeries.push([endTime, 0]);

    // Peak point is the exact point with maximum total
    let peakPt = exactPoints[0];
    exactPoints.forEach((pt) => {
      if (pt.total > peakPt.total) peakPt = pt;
    });

    return {
      seriesData: { total: totalSeries, completed: completedSeries },
      totalAmount: totalDisbursed,
      maxY: peakPt.total,
      peakPoint:
        peakPt.total > 0
          ? {
              timestamp: peakPt.timestamp,
              exactTimestamp: peakPt.timestamp,
              total: peakPt.total,
              completed: peakPt.completed,
            }
          : null,
      minTime: startTime,
      maxTime: endTime,
      xLabelPattern: spanMs <= 6 * HOUR ? 'hh:mm:ss a' : 'MMM dd, yyyy, hh:mm a',
      isLargeDataset: filteredEvents.length > 300,
    };
  }, [filteredEvents]);

  // ── Smart Y-axis ceiling ──────────────────────────────────────────
  const yCeiling = useMemo(() => {
    if (maxY <= 0) return 1;
    if (maxY <= 5) return maxY;
    if (maxY <= 10) return 10;
    if (maxY <= 20) return 20;
    if (maxY <= 50) return 50;
    if (maxY <= 100) return 100;

    const mag = Math.pow(10, Math.floor(Math.log10(maxY)));
    const frac = maxY / mag;
    if (frac <= 1.0) return mag;
    if (frac <= 1.25) return Math.ceil(1.25 * mag);
    if (frac <= 1.5) return Math.ceil(1.5 * mag);
    if (frac <= 2.0) return 2 * mag;
    if (frac <= 2.5) return Math.ceil(2.5 * mag);
    if (frac <= 5.0) return 5 * mag;
    return 10 * mag;
  }, [maxY]);

  // Compact Y-axis label formatter
  const yLabelFormatter = (val: number): string => {
    if (val === null || val === undefined) return '';
    const n = Number(val);
    if (isNaN(n)) return String(val);
    if (n >= 1_000_000) {
      const m = n / 1_000_000;
      return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
    }
    if (n >= 10_000) {
      const k = n / 1_000;
      return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
    }
    return formatNum(n);
  };

  // Translate labels for Peak and Txns
  const peakLabel = translateValue(tg, 'PEAK', { fallback: locale === 'ne' ? 'उच्चतम' : 'Peak' });
  const txnsLabel = translateValue(tg, 'TXNS', { fallback: locale === 'ne' ? 'कारोबारहरू' : 'txns' });

  // ── ApexCharts configuration ──────────────────────────────────────
  const chartOptions = useMemo<ApexCharts.ApexOptions>(() => {
    const totalLabel = translateValue(tv, 'TOTAL_TRANSACTIONS', { fallback: 'Total Transactions' });
    const completedLabel = translateValue(tg, 'COMPLETED', { fallback: 'Completed' });

    return {
      chart: {
        type: 'area',
        animations: {
          enabled: !isLargeDataset,
          dynamicAnimation: { enabled: false },
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true,
        },
        toolbar: {
          show: true,
          offsetY: -4,
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        offsetX: 0,
        offsetY: 0,
        locales: [
          {
            name: 'app',
            options: {
              toolbar: {
                zoomIn: translateValue(tg, 'ZOOM_IN', { fallback: 'Zoom In' }),
                zoomOut: translateValue(tg, 'ZOOM_OUT', { fallback: 'Zoom Out' }),
                pan: translateValue(tg, 'PAN', { fallback: 'Pan' }),
                reset: translateValue(tg, 'RESET', { fallback: 'Reset Zoom' }),
              },
            },
          },
        ],
        defaultLocale: 'app',
      },
      colors: ['#2563EB', '#059669'],
      stroke: {
        curve: 'smooth',
        width: [2.5, 2],
      },
      fill: {
        type: ['gradient', 'solid'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.2,
          opacityTo: 0.01,
          stops: [0, 90, 100],
        },
        opacity: [1, 0],
      },
      dataLabels: { enabled: false },
      xaxis: {
        type: 'datetime',
        min: minTime || undefined,
        max: maxTime || undefined,
        labels: {
          formatter: function (value) {
            return formatChartDate(value, xLabelPattern, locale);
          },
          rotate: 0,
          style: { fontSize: '11px', colors: '#64748B' },
        },
        axisBorder: { color: '#E2E8F0' },
        axisTicks: { color: '#E2E8F0' },
        tooltip: { enabled: false },
      },
      yaxis: {
        min: 0,
        max: yCeiling,
        forceNiceScale: false,
        labels: {
          formatter: yLabelFormatter,
          style: { fontSize: '11px', colors: '#64748B' },
        },
        title: {
          text: totalLabel,
          style: { fontSize: '12px', fontWeight: 500, color: '#94A3B8' },
        },
      },
      grid: {
        borderColor: '#F1F5F9',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
      },
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          formatter: function (value) {
            return formatChartDate(value, 'PPp', locale);
          },
        },
        y: {
          formatter: function (value) {
            if (value === null || value === undefined) return '';
            return formatNum(Math.round(Number(value)));
          },
        },
      },
      legend: {
        show: false,
      },
      // Peak annotation
      annotations: peakPoint
        ? {
            xaxis: [
              {
                x: peakPoint.timestamp,
                borderColor: '#2563EB',
                strokeDashArray: 4,
                label: {
                  text: `${peakLabel}: ${formatNum(peakPoint.total)} ${txnsLabel}`,
                  borderColor: '#2563EB',
                  style: {
                    color: '#fff',
                    background: '#2563EB',
                    fontSize: '11px',
                    padding: { left: 6, right: 6, top: 2, bottom: 2 },
                  },
                  orientation: 'horizontal',
                  position: 'bottom',
                },
              },
            ],
            points: [
              {
                x: peakPoint.timestamp,
                y: peakPoint.total,
                marker: {
                  size: 6,
                  fillColor: '#2563EB',
                  strokeColor: '#fff',
                  strokeWidth: 2,
                },
              },
            ],
          }
        : undefined,
      markers: {
        size: 0,
        hover: { sizeOffset: 4 },
      },
    };
  }, [seriesData, minTime, maxTime, xLabelPattern, yCeiling, peakPoint, locale, formatNum, tv, tg, peakLabel, txnsLabel, isLargeDataset]);

  const chartSeries = useMemo(() => {
    const totalLabel = translateValue(tv, 'TOTAL_TRANSACTIONS', { fallback: 'Total Transactions' });
    const completedLabel = translateValue(tg, 'COMPLETED', { fallback: 'Completed' });

    return [
      { name: totalLabel, data: seriesData.total },
      { name: completedLabel, data: seriesData.completed },
    ];
  }, [seriesData, tv, tg]);

  const chartHeight = useMemo(() => {
    if (seriesData.total.length <= 5) return 280;
    if (seriesData.total.length <= 20) return 320;
    return 360;
  }, [seriesData.total.length]);

  const handleDateChange = (range: any) => {
    setDateRange(range);
  };

  const handleClearDate = () => {
    setDateRange(undefined);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDateRange(undefined);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() || statusFilter !== 'ALL' || dateRange?.from
  );

  return (
    <div className="rounded-sm border border-gray-100 bg-white p-4 space-y-4">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Heading
            title={tg('TIMELINE')}
            description={translateValue(tv, 'OVERVIEW_OF_YOUR_PAYOUTS', { fallback: 'Timeline of payout transactions and disbursement progress' })}
            titleStyle="font-medium text-lg text-gray-900"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            className="w-48 sm:w-56"
            name={translateValue(tv, 'SEARCH_BENEFICIARY_WALLET', { fallback: 'Search wallet...' })}
            onSearch={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />

          <SelectComponent
            name={tg('STATUS')}
            options={['ALL', 'COMPLETED', 'PENDING', 'FAILED']}
            labels={{
              ALL: tg('ALL'),
              COMPLETED: translateValue(tg, 'COMPLETED', { fallback: 'Completed' }),
              PENDING: translateValue(tg, 'PENDING', { fallback: 'Pending' }),
              FAILED: translateValue(tg, 'FAILED', { fallback: 'Failed' }),
            }}
            onChange={(val) => setStatusFilter(val)}
            value={statusFilter}
            className="w-36"
          />

          <DateRangePicker
            placeholder={tg('PICK_DATE_RANGE')}
            handleDateChange={handleDateChange}
            handleClearDate={handleClearDate}
            type="range"
            className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center h-[clamp(28px,3vw,36px)] px-2 text-xs text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              {translateValue(tg, 'RESET', { fallback: 'Reset' })}
            </button>
          )}
        </div>
      </div>

      {/* Timeline Chart Card */}
      <div className="border border-gray-200 rounded-sm p-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-900">
              {translateValue(tv, 'TRANSACTION_TIMELINE', { fallback: translateValue(tg, 'TIMELINE', { fallback: 'Transaction Timeline' }) })}
            </h2>
            {peakPoint && peakPoint.total > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {peakLabel}: {formatNum(peakPoint.total)} {txnsLabel} ({formatChartDate((peakPoint as any).exactTimestamp || peakPoint.timestamp, 'PPp', locale)})
              </span>
            )}
            <div className="flex items-center gap-3.5 text-xs font-medium text-slate-600 sm:ml-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                {translateValue(tv, 'TOTAL_TRANSACTIONS', { fallback: 'Total Transactions' })}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                {translateValue(tg, 'COMPLETED', { fallback: 'Completed' })}
              </span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {totalAmount > 0 && (
              <>
                {translateValue(tg, 'DISBURSED', { fallback: 'Disbursed' })}:{' '}
                <strong className="text-gray-900">
                  {tg('RS')} {formatNum(totalAmount)}
                </strong>
              </>
            )}
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <TableLoader />
          </div>
        ) : seriesData.total.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <NoResult />
          </div>
        ) : (
          <ApexChart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={chartHeight}
          />
        )}
      </div>
    </div>
  );
}
