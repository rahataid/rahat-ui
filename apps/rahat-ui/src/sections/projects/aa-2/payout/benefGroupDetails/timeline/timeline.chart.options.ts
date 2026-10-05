import type {
  FormatNumRef,
  SeriesData,
  TimelineChartLabels,
} from './timeline.types';
import { formatChartDate } from './timeline.utils';
import { getStatusColor } from './timeline.status';

type ChartOptionsParams = {
  minTime: number;
  maxTime: number;
  xLabelPattern: string;
  yCeiling: number;
  locale: string;
  isLargeDataset: boolean;
  labels: TimelineChartLabels;
  formatNumRef: FormatNumRef;
  activeStatuses: string[];
  seriesData: SeriesData;
};

const yLabelFormatter = (formatNumRef: FormatNumRef) => (val: number): string => {
  if (val === null || val === undefined) return '';
  const n = Math.round(Number(val));
  if (isNaN(n)) return String(val);
  return formatNumRef.current(n);
};

export const buildTimelineChartOptions = ({
  minTime,
  maxTime,
  xLabelPattern,
  yCeiling,
  locale,
  isLargeDataset,
  labels,
  formatNumRef,
  activeStatuses,
  seriesData,
}: ChartOptionsParams): ApexCharts.ApexOptions => {
  const seriesColors = [
    '#2563EB',
    ...activeStatuses.map((s) => getStatusColor(s)),
  ];

  return {
    chart: {
      type: 'area',
      stacked: false,
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
          selection: false,
          zoom: false,
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
    },
    colors: seriesColors,
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.28,
        opacityTo: 0.02,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 4.5,
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 7,
      },
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
      crosshairs: {
        show: true,
        width: 1,
        stroke: {
          color: '#94A3B8',
          width: 1,
          dashArray: 4,
        },
      },
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
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const xVal =
          w.globals.seriesX[seriesIndex]?.[dataPointIndex] ||
          w.globals.seriesX[0]?.[dataPointIndex];
        if (!xVal) return '';

        const exactTimeHeader =
          seriesData.exactTimes?.[Number(xVal)] ||
          formatChartDate(xVal, 'PPp', locale);

        const totalVal = series[0]?.[dataPointIndex] ?? 0;

        let itemsHtml = '';
        itemsHtml += `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 4px; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #2563EB; display: inline-block;"></span>
              <span style="color: #475569; font-weight: 500;">${labels.allTransactions}</span>
            </div>
            <strong style="color: #0F172A; font-weight: 700;">${formatNumRef.current(totalVal)}</strong>
          </div>
        `;

        for (let i = 1; i < series.length; i++) {
          const val = series[i]?.[dataPointIndex] ?? 0;
          if (totalVal > 0 && val === 0) continue;
          const seriesName = w.globals.seriesNames[i] || '';
          const color = w.globals.colors[i] || '#64748B';
          itemsHtml += `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 5px; font-size: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; display: inline-block;"></span>
                <span style="color: #475569; font-weight: 500;">${seriesName}</span>
              </div>
              <strong style="color: #0F172A; font-weight: 700;">${formatNumRef.current(val)}</strong>
            </div>
          `;
        }

        return `
          <div style="padding: 10px 14px; font-family: inherit; font-size: 12px; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); min-width: 190px;">
            <div style="font-weight: 600; color: #1E293B; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px; margin-bottom: 6px;">
              ${exactTimeHeader}
            </div>
            ${itemsHtml}
          </div>
        `;
      },
    },
    legend: { show: false },
  };
};
