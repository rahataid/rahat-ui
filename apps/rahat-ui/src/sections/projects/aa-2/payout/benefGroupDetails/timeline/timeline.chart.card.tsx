'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { CATEGORY_META } from './timeline.chart.options';
import {
  Bar as RechartsBar,
  BarChart as RechartsBarChart,
  Brush as RechartsBrush,
  CartesianGrid as RechartsCartesianGrid,
  ResponsiveContainer as RechartsResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
} from 'recharts';
import { buildTimelineSeries, niceYCeiling } from './timeline.data';
import type {
  BucketDetail,
  CategoryCounts,
  CategoryKey,
  StatusCounts,
  TimelineChartLabels,
  TimelineEvent,
} from './timeline.types';
import { getStatusLabel } from './timeline.status';

const CATS: CategoryKey[] = ['success', 'inProgress', 'failed'];

type ZoomState = { min: number; max: number };
type BrushRange = { startIndex?: number; endIndex?: number };

type TimelineChartDatum = {
  timestamp: number;
  time: string;
  success: number;
  inProgress: number;
  failed: number;
  total: number;
  exactTime: string;
  detail: BucketDetail;
};

type TimelineChartCardProps = {
  events: TimelineEvent[];
  statusCounts: StatusCounts;
  categoryCounts: CategoryCounts;
  totalAmount: number;
  undatedCount: number;
  isLargeDataset: boolean;
  isFsp: boolean;
  loading: boolean;
};

export default function TimelineChartCard({
  events,
  statusCounts,
  categoryCounts,
  totalAmount,
  undatedCount,
  isLargeDataset,
  isFsp,
  loading,
}: TimelineChartCardProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const locale = useLocale();
  const formatNum = useNumberFormat();

  const [zoomStack, setZoomStack] = useState<ZoomState[]>([]);
  const [brushRange, setBrushRange] = useState<BrushRange | null>(null);
  const currentZoom = zoomStack.length > 0 ? zoomStack[zoomStack.length - 1] : null;

  const prevEventsRef = useRef(events);
  useEffect(() => {
    if (prevEventsRef.current !== events) {
      prevEventsRef.current = events;
      setZoomStack([]);
      setBrushRange(null);
    }
  }, [events]);

  const zoomedEvents = useMemo(() => {
    if (!currentZoom) return events;
    return events.filter(
      (ev) => ev.timestamp >= currentZoom.min && ev.timestamp <= currentZoom.max,
    );
  }, [events, currentZoom]);

  const series = useMemo(() => {
    return buildTimelineSeries(zoomedEvents, 'all', locale, isFsp);
  }, [zoomedEvents, locale, isFsp]);

  const yCeiling = useMemo(() => niceYCeiling(series.maxY), [series.maxY]);

  const labels = useMemo<TimelineChartLabels>(
    () => ({
      title: translateValue(tv, 'TRANSACTION_VOLUME_OVER_TIME', {
        fallback: 'Transaction Volume Over Time',
      }),
      subtitle: translateValue(tv, 'TRANSACTION_VOLUME_SUBTITLE', {
        fallback: 'Volume of transactions by status at each timestamp',
      }),
      allTransactions: translateValue(tv, 'ALL_TRANSACTIONS', {
        fallback: 'All Transactions',
      }),
      disbursed: translateValue(tg, 'DISBURSED', { fallback: 'Disbursed' }),
      total: translateValue(tv, 'TOTAL_TRANSACTIONS', {
        fallback: 'Total Transactions',
      }),
      transactions: translateValue(tv, 'TRANSACTIONS', {
        fallback: translateValue(tg, 'TRANSACTIONS', { fallback: 'Transactions' }),
      }),
      time: translateValue(tv, 'TIME', {
        fallback: translateValue(tg, 'TIME', { fallback: 'Time' }),
      }),
      success: translateValue(tv, 'SUCCESS', {
        fallback: translateValue(tg, 'SUCCESS', { fallback: 'Success' }),
      }),
      inProgress: translateValue(tv, 'IN_PROGRESS', {
        fallback: translateValue(tg, 'IN_PROGRESS', { fallback: 'In Progress' }),
      }),
      failed: translateValue(tv, 'FAILED', {
        fallback: translateValue(tg, 'FAILED', { fallback: 'Failed' }),
      }),
      statusLabels: {
        COMPLETED: translateValue(tg, 'COMPLETED', { fallback: 'Completed' }),
        PARTIALLY_COMPLETED: translateValue(tg, 'PARTIALLY_COMPLETED', {
          fallback: 'Partially Completed',
        }),
        TOKEN_TRANSACTION_COMPLETED: translateValue(
          tg,
          'TOKEN_TRANSACTION_COMPLETED',
          { fallback: 'Token Completed' },
        ),
        FIAT_TRANSACTION_COMPLETED: translateValue(
          tg,
          'FIAT_TRANSACTION_COMPLETED',
          { fallback: 'Fiat Completed' },
        ),
        PENDING: translateValue(tg, 'PENDING', { fallback: 'Pending' }),
        TOKEN_TRANSACTION_INITIATED: translateValue(
          tg,
          'TOKEN_TRANSACTION_INITIATED',
          { fallback: 'Token Initiated' },
        ),
        FIAT_TRANSACTION_INITIATED: translateValue(
          tg,
          'FIAT_TRANSACTION_INITIATED',
          { fallback: 'Fiat Initiated' },
        ),
        FAILED: translateValue(tg, 'FAILED', { fallback: 'Failed' }),
        TOKEN_TRANSACTION_FAILED: translateValue(tg, 'TOKEN_TRANSACTION_FAILED', {
          fallback: 'Token Failed',
        }),
        FIAT_TRANSACTION_FAILED: translateValue(tg, 'FIAT_TRANSACTION_FAILED', {
          fallback: 'Fiat Failed',
        }),
        CANCELLED: translateValue(tg, 'CANCELLED', { fallback: 'Cancelled' }),
      },
      zoomIn: translateValue(tg, 'ZOOM_IN', { fallback: 'Zoom In' }),
      zoomOut: translateValue(tg, 'ZOOM_OUT', { fallback: 'Zoom Out' }),
      pan: translateValue(tg, 'PAN', { fallback: 'Pan' }),
      reset: translateValue(tg, 'RESET', { fallback: 'Reset Zoom' }),
    }),
    [tg, tv, locale],
  );

  const handleResetZoom = () => {
    setZoomStack([]);
    setBrushRange(null);
  };

  const handleZoomOut = () => {
    setZoomStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
    setBrushRange(null);
  };

  const chartData = useMemo<TimelineChartDatum[]>(
    () =>
      series.seriesData.xLabels.map((time, index) => {
        const success = series.seriesData.perCategory.success[index] ?? 0;
        const inProgress = series.seriesData.perCategory.inProgress[index] ?? 0;
        const failed = series.seriesData.perCategory.failed[index] ?? 0;
        return {
          timestamp: series.seriesData.bucketTimestamps[index],
          time,
          success,
          inProgress,
          failed,
          total: success + inProgress + failed,
          exactTime: series.seriesData.exactTimes[index] ?? time,
          detail: series.seriesData.bucketDetails[index],
        };
      }),
    [series.seriesData],
  );

  const hasData = chartData.length > 0;
  const isZoomed = zoomStack.length > 0;
  const applyBrushZoom = () => {
    if (!brushRange || chartData.length < 2) return;
    const startIndex = Math.max(0, brushRange.startIndex ?? 0);
    const endIndex = Math.min(
      chartData.length - 1,
      brushRange.endIndex ?? chartData.length - 1,
    );
    if (endIndex <= startIndex) return;

    const min = chartData[startIndex]?.timestamp;
    const max = chartData[endIndex]?.timestamp;
    if (min == null || max == null || min >= max) return;
    setZoomStack((prev) => [
      ...prev,
      { min, max: max + (series.stepMs || 60_000) },
    ]);
    setBrushRange(null);
  };

  return (
    <div className="rounded-sm border border-gray-100 bg-white p-3 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
            {labels.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {labels.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {totalAmount > 0 && (
              <div className="text-xs whitespace-nowrap bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-sm">
                {labels.disbursed}:{' '}
                <strong className="font-semibold text-emerald-950">
                  {tg('RS')} {formatNum(totalAmount)}
                </strong>
              </div>
            )}
            {isZoomed && (
              <div className="text-xs whitespace-nowrap bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-sm">
                {locale === 'ne'
                  ? `${formatNum(events.length)} मध्ये ${formatNum(zoomedEvents.length)} कारोबारहरू देखाइएको`
                  : `Showing ${formatNum(zoomedEvents.length)} of ${formatNum(events.length)} transactions`}
              </div>
            )}
          </div>
        </div>
        {isZoomed && (
          <div className="flex items-center gap-1.5">
            {zoomStack.length > 1 && (
              <button
                onClick={handleZoomOut}
                className="text-xs text-slate-600 hover:text-slate-800 font-medium px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
              >
                {labels.zoomOut}
              </button>
            )}
            <button
              onClick={handleResetZoom}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
            >
              {labels.reset}
            </button>
          </div>
        )}
        {brushRange && chartData.length > 1 && (
          <button
            onClick={applyBrushZoom}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
          >
            {labels.zoomIn}
          </button>
        )}
      </div>

      {undatedCount > 0 && (
        <p className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded-sm px-2.5 py-1">
          {tv('TIMELINE_MISSING_TIMESTAMP', { count: undatedCount })}
        </p>
      )}

      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <TableLoader />
        </div>
      ) : !hasData ? (
        <div className="h-72 flex items-center justify-center">
          <NoResult />
        </div>
      ) : (
        <>
          <div className="h-[360px] w-full min-w-0">
            <RechartsResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={chartData}
                margin={{ top: 16, right: 16, bottom: 56, left: 18 }}
                barCategoryGap={
                  chartData.length <= 5
                    ? '40%'
                    : chartData.length <= 20
                      ? '30%'
                      : '20%'
                }
              >
                <RechartsCartesianGrid
                  stroke="#CBD5E1"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <RechartsXAxis
                  dataKey="time"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }}
                  tickLine={{ stroke: '#CBD5E1' }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  label={{
                    value: labels.time || 'Time',
                    position: 'insideBottom',
                    offset: -44,
                    fill: '#1E293B',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
                <RechartsYAxis
                  domain={[0, yCeiling]}
                  allowDecimals={false}
                  tickFormatter={(value: number) => formatNum(value)}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#334155' }}
                  tickLine={{ stroke: '#CBD5E1' }}
                  axisLine={{ stroke: '#CBD5E1' }}
                  label={{
                    value: labels.transactions || 'Transactions',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#1E293B',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
                <RechartsTooltip
                  cursor={{
                    fill: '#F8FAFC',
                    stroke: '#CBD5E1',
                    strokeDasharray: '3 3',
                  }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0]?.payload as TimelineChartDatum;
                    if (!point) return null;

                    return (
                      <div className="min-w-[210px] max-w-[320px] rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-lg">
                        <div className="mb-1.5 border-b border-slate-100 pb-1.5 font-semibold text-slate-800">
                          {point.exactTime}
                        </div>
                        <div className="mb-2 flex justify-between text-[11px] text-slate-500">
                          <span>{labels.total || 'Total'}</span>
                          <strong className="text-slate-900">
                            {formatNum(point.total)}
                          </strong>
                        </div>
                        {CATS.map((cat) => {
                          const count = point[cat];
                          if (!count) return null;
                          const categoryLabel =
                            labels[cat] || CATEGORY_META[cat].label;
                          const entries = Object.entries(
                            point.detail?.[cat] ?? {},
                          ).sort((a, b) => b[1] - a[1]);

                          return (
                            <div key={cat} className="mb-1.5 last:mb-0">
                              <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-sm"
                                    style={{
                                      backgroundColor: CATEGORY_META[cat].color,
                                    }}
                                  />
                                  {categoryLabel}
                                </span>
                                <strong className="text-slate-900">
                                  {formatNum(count)}
                                </strong>
                              </div>
                              {entries.map(([status, statusCount]) => (
                                <div
                                  key={status}
                                  className="mt-0.5 flex justify-between gap-3 pl-4 text-[11px] text-slate-500"
                                >
                                  <span>
                                    {labels.statusLabels?.[status] ||
                                      getStatusLabel(status)}
                                  </span>
                                  <span>{formatNum(statusCount)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                />
                {CATS.map((cat) => (
                  <RechartsBar
                    key={cat}
                    dataKey={cat}
                    name={labels[cat] || CATEGORY_META[cat].label}
                    stackId="transactions"
                    fill={CATEGORY_META[cat].color}
                    radius={[2, 2, 0, 0]}
                    isAnimationActive={!isLargeDataset}
                  />
                ))}
                {chartData.length > 1 && (
                  <RechartsBrush
                    key={`brush-${zoomStack.length}-${currentZoom?.min ?? 'full'}`}
                    dataKey="time"
                    height={20}
                    travellerWidth={8}
                    stroke="#64748B"
                    onChange={(range) => {
                      if (!range) {
                        setBrushRange(null);
                        return;
                      }
                      const startIndex = range.startIndex ?? 0;
                      const endIndex = range.endIndex ?? chartData.length - 1;
                      setBrushRange(
                        startIndex === 0 && endIndex === chartData.length - 1
                          ? null
                          : range,
                      );
                    }}
                  />
                )}
              </RechartsBarChart>
            </RechartsResponsiveContainer>
          </div>
          {/*
          <ApexChart
            key={isZoomed ? `zoom-${zoomStack.length}-${currentZoom!.min}` : 'full'}
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={360}
          />
          */}
        </>
      )}

      {hasData && (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-800">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-slate-500" />
            <span>{labels.allTransactions}</span>
            <span className="text-slate-600 font-semibold">
              ({formatNum(statusCounts.total)})
            </span>
          </span>
          {CATS.map((cat) => {
            const count = categoryCounts[cat];
            if (count === 0) return null;
            const meta = CATEGORY_META[cat];
            return (
              <span key={cat} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded inline-block"
                  style={{ backgroundColor: meta.color }}
                />
                <span>{labels[cat] || meta.label}</span>
                <span className="text-slate-600 font-semibold">
                  ({formatNum(count)})
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
