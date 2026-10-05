'use client';

import { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { buildTimelineChartOptions } from './timeline.chart.options';
import { getStatusColor, getStatusLabel } from './timeline.status';
import type {
  SeriesData,
  StatusCounts,
  TimelineChartLabels,
} from './timeline.types';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TimelineChartCardProps = {
  seriesData: SeriesData;
  activeStatuses: string[];
  chartStatuses?: string[];
  statusCounts: StatusCounts;
  yCeiling: number;
  minTime: number;
  maxTime: number;
  xLabelPattern: string;
  totalAmount: number;
  undatedCount: number;
  isLargeDataset: boolean;
  timeWindowText: string;
  durationText: string;
  loading: boolean;
};

export default function TimelineChartCard({
  seriesData,
  activeStatuses,
  chartStatuses,
  statusCounts,
  yCeiling,
  minTime,
  maxTime,
  xLabelPattern,
  totalAmount,
  undatedCount,
  isLargeDataset,
  timeWindowText,
  durationText,
  loading,
}: TimelineChartCardProps) {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const locale = useLocale();
  const formatNum = useNumberFormat();

  const formatNumRef = useRef(formatNum);
  formatNumRef.current = formatNum;

  const renderStatuses = useMemo(() => {
    return chartStatuses && chartStatuses.length > 0
      ? chartStatuses
      : activeStatuses;
  }, [chartStatuses, activeStatuses]);

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

  const chartOptions = useMemo(
    () =>
      buildTimelineChartOptions({
        minTime,
        maxTime,
        xLabelPattern,
        yCeiling,
        locale,
        isLargeDataset,
        labels,
        formatNumRef,
        activeStatuses: renderStatuses,
        seriesData,
      }),
    [
      minTime,
      maxTime,
      xLabelPattern,
      yCeiling,
      locale,
      isLargeDataset,
      labels,
      formatNumRef,
      renderStatuses,
      seriesData,
    ],
  );

  const chartSeries = useMemo(() => {
    return [
      { name: labels.allTransactions, data: seriesData.total },
      ...renderStatuses.map((s) => ({
        name: getStatusLabel(s),
        data: seriesData.perStatus[s] || [],
      })),
    ];
  }, [seriesData, labels.allTransactions, renderStatuses]);

  const hasData = seriesData.total.length > 0;

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
          </div>
        </div>
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
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={340}
        />
      )}

      {hasData && (
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block bg-blue-600" />
            <span>{labels.allTransactions}</span>
            <span className="text-slate-400 font-normal">
              ({formatNum(statusCounts.total)})
            </span>
          </span>
          {activeStatuses.map((s) => (
            <span key={s} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: getStatusColor(s) }}
              />
              <span>{getStatusLabel(s)}</span>
              <span className="text-slate-400 font-normal">
                ({formatNum(statusCounts.perStatus[s] || 0)})
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
