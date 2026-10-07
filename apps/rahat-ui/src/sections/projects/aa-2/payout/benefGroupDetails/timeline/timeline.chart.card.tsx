'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import {
  buildTimelineChartOptions,
  CATEGORY_META,
} from './timeline.chart.options';
import { buildTimelineSeries, niceYCeiling } from './timeline.data';
import type {
  CategoryCounts,
  CategoryKey,
  StatusCounts,
  TimelineChartLabels,
  TimelineEvent,
} from './timeline.types';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CATS: CategoryKey[] = ['success', 'inProgress', 'failed'];

type ZoomState = { min: number; max: number };

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
  const formatNumRef = useRef(formatNum);
  formatNumRef.current = formatNum;

  const [zoomStack, setZoomStack] = useState<ZoomState[]>([]);
  const currentZoom = zoomStack.length > 0 ? zoomStack[zoomStack.length - 1] : null;

  const prevEventsRef = useRef(events);
  useEffect(() => {
    if (prevEventsRef.current !== events) {
      prevEventsRef.current = events;
      setZoomStack([]);
    }
  }, [events]);

  const seriesRef = useRef<ReturnType<typeof buildTimelineSeries> | null>(null);

  const zoomedEvents = useMemo(() => {
    if (!currentZoom) return events;
    return events.filter(
      (ev) => ev.timestamp >= currentZoom.min && ev.timestamp <= currentZoom.max,
    );
  }, [events, currentZoom]);

  const series = useMemo(() => {
    const result = buildTimelineSeries(zoomedEvents, 'all', locale, isFsp);
    seriesRef.current = result;
    return result;
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
      txns: translateValue(tg, 'TXNS', {
        fallback: locale === 'ne' ? 'कारोबारहरू' : 'txns',
      }),
      disbursed: translateValue(tg, 'DISBURSED', { fallback: 'Disbursed' }),
      total: translateValue(tv, 'TOTAL_TRANSACTIONS', {
        fallback: 'Total Transactions',
      }),
      zoomIn: translateValue(tg, 'ZOOM_IN', { fallback: 'Zoom In' }),
      zoomOut: translateValue(tg, 'ZOOM_OUT', { fallback: 'Zoom Out' }),
      pan: translateValue(tg, 'PAN', { fallback: 'Pan' }),
      reset: translateValue(tg, 'RESET', { fallback: 'Reset Zoom' }),
    }),
    [tg, tv, locale],
  );

  const handleZoomed = useCallback(
    (_chart: any, opts: { xaxis: { min: number; max: number } }) => {
      if (!opts?.xaxis || opts.xaxis.min == null || opts.xaxis.max == null) return;

      const s = seriesRef.current;
      if (!s) return;

      const timestamps = s.seriesData.bucketTimestamps;
      if (!timestamps.length) return;

      const minIdx = Math.max(0, Math.floor(opts.xaxis.min) - 1);
      const maxIdx = Math.min(timestamps.length - 1, Math.ceil(opts.xaxis.max) - 1);

      const tMin = timestamps[minIdx];
      const tMax = timestamps[maxIdx];

      if (tMin == null || tMax == null || tMin > tMax) return;

      const stepMs = s.stepMs || 60_000;
      setZoomStack((prev) => {
        const nextMin = tMin;
        const nextMax = tMax + stepMs;
        if (
          prev.length > 0 &&
          prev[prev.length - 1].min === nextMin &&
          prev[prev.length - 1].max === nextMax
        ) {
          return prev;
        }
        return [...prev, { min: nextMin, max: nextMax }];
      });
    },
    [],
  );

  const handleResetZoom = useCallback(() => {
    setZoomStack([]);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  }, []);

  const chartOptions = useMemo(
    () =>
      buildTimelineChartOptions({
        yCeiling,
        locale,
        isLargeDataset,
        labels,
        formatNumRef,
        seriesData: series.seriesData,
        onZoomed: handleZoomed,
        onResetZoom: handleResetZoom,
      }),
    [yCeiling, locale, isLargeDataset, labels, series.seriesData, handleZoomed, handleResetZoom],
  );

  const chartSeries = useMemo(
    () =>
      CATS.map((cat) => ({
        name: CATEGORY_META[cat].label,
        data: series.seriesData.perCategory[cat] || [],
      })),
    [series.seriesData],
  );

  const hasData = series.seriesData.xLabels.length > 0;
  const isZoomed = zoomStack.length > 0;

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
        <ApexChart
          key={isZoomed ? `zoom-${zoomStack.length}-${currentZoom!.min}` : 'full'}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={340}
        />
      )}

      {hasData && (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-slate-400" />
            <span>{labels.allTransactions}</span>
            <span className="text-slate-400 font-normal">
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
                <span>{meta.label}</span>
                <span className="text-slate-400 font-normal">
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
