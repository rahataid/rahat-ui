import type {
  CategoryKey,
  FormatNumRef,
  SeriesData,
  TimelineChartLabels,
} from './timeline.types';
import { getStatusLabel } from './timeline.status';

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; color: string }
> = {
  success: { label: 'Success', color: '#22C55E' },
  inProgress: { label: 'In Progress', color: '#3B82F6' },
  failed: { label: 'Failed', color: '#EF4444' },
};

type ChartOptionsParams = {
  yCeiling: number;
  locale: string;
  isLargeDataset: boolean;
  labels: TimelineChartLabels;
  formatNumRef: FormatNumRef;
  seriesData: SeriesData;
  onZoomed?: (chart: any, opts: { xaxis: { min: number; max: number } }) => void;
  onResetZoom?: () => void;
};

const yLabelFormatter =
  (formatNumRef: FormatNumRef) =>
  (val: number): string => {
    if (val === null || val === undefined) return '';
    const n = Math.round(Number(val));
    if (isNaN(n)) return String(val);
    return formatNumRef.current(n);
  };

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#22C55E',
  PARTIALLY_COMPLETED: '#84CC16',
  TOKEN_TRANSACTION_COMPLETED: '#10B981',
  FIAT_TRANSACTION_COMPLETED: '#14B8A6',
  PENDING: '#F59E0B',
  TOKEN_TRANSACTION_INITIATED: '#8B5CF6',
  FIAT_TRANSACTION_INITIATED: '#6366F1',
  FAILED: '#DC2626',
  TOKEN_TRANSACTION_FAILED: '#EF4444',
  FIAT_TRANSACTION_FAILED: '#F97316',
  CANCELLED: '#9CA3AF',
};

export const buildTimelineChartOptions = ({
  yCeiling,
  isLargeDataset,
  labels,
  formatNumRef,
  seriesData,
  onZoomed,
  onResetZoom,
}: ChartOptionsParams): ApexCharts.ApexOptions => {
  const CATS: CategoryKey[] = ['success', 'inProgress', 'failed'];
  const barCount = seriesData.xLabels.length;

  return {
    chart: {
      type: 'bar',
      stacked: true,
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
      locales: [
        {
          name: 'app',
          options: {
            toolbar: {
              zoomIn: labels.zoomIn,
              zoomOut: labels.zoomOut,
              pan: labels.pan,
              reset: labels.reset,
            },
          },
        },
      ],
      defaultLocale: 'app',
      events: {
        ...(onZoomed ? { zoomed: onZoomed } : {}),
        ...(onResetZoom
          ? {
              beforeResetZoom: () => {
                onResetZoom();
                return undefined;
              },
            }
          : {}),
      },
    },
    colors: CATS.map((c) => CATEGORY_META[c].color),
    plotOptions: {
      bar: {
        columnWidth: barCount <= 5 ? '40%' : barCount <= 20 ? '60%' : '80%',
        borderRadius: 2,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'category',
      categories: seriesData.xLabels,
      labels: {
        rotate: -45,
        rotateAlways: barCount > 15,
        trim: true,
        maxHeight: 80,
        style: { fontSize: '10px', colors: '#64748B' },
      },
      axisBorder: { color: '#E2E8F0' },
      axisTicks: { color: '#E2E8F0' },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      max: yCeiling,
      forceNiceScale: true,
      labels: {
        formatter: yLabelFormatter(formatNumRef),
        style: { fontSize: '11px', colors: '#64748B' },
      },
      title: {
        text: 'Transactions',
        style: { fontSize: '12px', fontWeight: 500, color: '#64748B' },
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
      custom: function ({ dataPointIndex, w }) {
        const timeHeader =
          seriesData.exactTimes?.[dataPointIndex] ||
          w.globals.labels?.[dataPointIndex] ||
          '';

        const detail = seriesData.bucketDetails?.[dataPointIndex];

        let totalCount = 0;
        CATS.forEach((_, ci) => {
          totalCount += w.globals.series[ci]?.[dataPointIndex] ?? 0;
        });

        let html = `
          <div style="padding: 10px 14px; font-family: inherit; font-size: 12px; background: #fff; border: 1px solid #E2E8F0; border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(0,0,0,.1); min-width: 210px; max-width: 320px;">
            <div style="font-weight: 600; color: #1E293B; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; margin-bottom: 6px;">
              ${timeHeader}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748B; margin-bottom: 8px;">
              <span>${labels.total || 'Total'}</span>
              <strong style="color: #0F172A;">${formatNumRef.current(totalCount)}</strong>
            </div>`;

        CATS.forEach((cat, ci) => {
          const catVal = w.globals.series[ci]?.[dataPointIndex] ?? 0;
          if (catVal === 0) return;

          const meta = CATEGORY_META[cat];
          html += `
            <div style="margin-bottom: 6px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="width: 10px; height: 10px; border-radius: 2px; background: ${meta.color}; display: inline-block;"></span>
                  <span style="font-weight: 600; color: #334155;">${meta.label}</span>
                </div>
                <strong style="color: #0F172A;">${formatNumRef.current(catVal)}</strong>
              </div>`;

          if (detail?.[cat]) {
            const entries = Object.entries(detail[cat]).sort(
              (a, b) => b[1] - a[1],
            );
            entries.forEach(([status, count]) => {
              const sColor = STATUS_COLORS[status] || '#64748B';
              html += `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-left: 16px; margin-top: 2px; font-size: 11px; color: #64748B;">
                <div style="display: flex; align-items: center; gap: 5px;">
                  <span style="width: 6px; height: 6px; border-radius: 50%; background: ${sColor}; display: inline-block;"></span>
                  <span>${getStatusLabel(status)}</span>
                </div>
                <span>${formatNumRef.current(count)}</span>
              </div>`;
            });
          }

          html += `</div>`;
        });

        html += `</div>`;
        return html;
      },
    },
    legend: { show: false },
  };
};
