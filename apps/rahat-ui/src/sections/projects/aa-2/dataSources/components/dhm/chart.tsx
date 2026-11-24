'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/i18n/date';
import { roundValue } from '../aws/utils/color.utils';

const CHART_DATE_PATTERN_MAP: Record<string, Intl.DateTimeFormatOptions> = {
  'h:mm a': { hour: 'numeric', minute: '2-digit', hour12: true },
  'MMMM d': { month: 'long', day: 'numeric' },
  'MMM d': { month: 'short', day: 'numeric' },
  PPp: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  },
};

const formatChartDate = (
  value: string | number,
  pattern: string,
  locale: string,
) => {
  const options =
    CHART_DATE_PATTERN_MAP[pattern] ?? CHART_DATE_PATTERN_MAP['h:mm a'];
  const neOptions =
    locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat(
    locale === 'ne' ? 'ne-NP' : locale,
    neOptions,
  );
  if (locale === 'ne' && (options.weekday || options.month)) {
    return localizeNepaliParts(date, options, formatter.formatToParts(date));
  }
  return formatter.format(date);
};

type ChartProps = {
  data: Record<string, any>[];
  dangerLevel?: string | number;
  warningLevel?: string | number;
  extremeLevel?: string | number;
  yaxisTitle?: string;
  unit?: string;
  xDateFormat?: string;
  yAxisFormatter?: (value: number) => string;
};

const SERIES_COLORS = ['#1d4ed8', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

const TimeSeriesChart = ({
  data,
  dangerLevel,
  warningLevel,
  extremeLevel,
  xDateFormat = 'h:mm a',
  yaxisTitle: yaxisTitleProp,
  unit = '',
  yAxisFormatter,
}: ChartProps) => {
  const t = useTranslations('AA_PROJECT');
  const locale = useLocale();
  const formatNum = useNumberFormat();
  const resolvedYaxisTitle = yaxisTitleProp ?? t('WATER_LEVEL_METERS');

  if (!data?.length) return null;

  const keys = Object.keys(data[0]).filter((key) => key !== 'datetime');
  if (!keys.length) return null;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
  const chartData = sortedData.flatMap((row) => {
    const convertedDate = convertToLocalTimeOrMillisecond(row.datetime);
    if (!convertedDate || !Number.isFinite(convertedDate.timestamp)) return [];

    const point: Record<string, number> = {
      timestamp: convertedDate.timestamp,
    };
    keys.forEach((key) => {
      const value = Number(row[key]);
      if (Number.isFinite(value)) {
        point[key] = Number(roundValue(value));
      }
    });
    return [point];
  });

  const thresholds = [
    { value: warningLevel, label: t('WARNING_LEVEL'), color: '#FFA500' },
    { value: dangerLevel, label: t('DANGER_LEVEL'), color: '#FF0000' },
    { value: extremeLevel, label: t('EXTREME_LEVEL'), color: '#A51D1D' },
  ].flatMap((threshold) => {
    if (threshold.value == null || threshold.value === '') return [];
    const value = Number(threshold.value);
    return Number.isFinite(value) ? [{ ...threshold, value }] : [];
  });

  const values = chartData.flatMap((point) =>
    keys.flatMap((key) => (Number.isFinite(point[key]) ? [point[key]] : [])),
  );
  if (!chartData.length || !values.length) return null;

  const valuesAndThresholds = [
    ...values,
    ...thresholds.map((threshold) => threshold.value),
  ];
  const minY = Math.min(...valuesAndThresholds);
  const maxY = Math.max(...valuesAndThresholds);

  const formatYAxisValue = (value: number) => {
    const roundedValue = roundValue(Number(value));
    if (typeof yAxisFormatter === 'function') {
      try {
        return yAxisFormatter(Number(roundedValue));
      } catch (error) {
        console.warn('yAxisFormatter threw error:', error);
      }
    }
    return formatNum(roundedValue);
  };

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 24, bottom: 30, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value: number) =>
              formatChartDate(value, xDateFormat, locale)
            }
            tick={{ fontSize: 12 }}
            tickLine={false}
            label={{
              value: t('TIME_STAMP'),
              position: 'insideBottom',
              offset: -20,
            }}
          />
          <YAxis
            domain={[minY - 0.5, maxY + 0.5]}
            tickFormatter={formatYAxisValue}
            tick={{ fontSize: 12 }}
            label={{
              value: resolvedYaxisTitle,
              angle: -90,
              position: 'insideLeft',
              offset: 0,
            }}
          />
          <Tooltip
            labelFormatter={(value: number) =>
              formatChartDate(value, 'PPp', locale)
            }
            formatter={(value: number, name: string) => [
              `${formatNum(roundValue(Number(value)))} ${unit}`,
              name,
            ]}
          />
          {thresholds.map((threshold) => (
            <ReferenceLine
              key={threshold.label}
              y={threshold.value}
              stroke={threshold.color}
              strokeDasharray="5 5"
              label={{
                value: threshold.label,
                position: 'insideTopRight',
                fill: threshold.color,
                fontSize: 12,
              }}
            />
          ))}
          {keys.map((key, index) => (
            <Area
              key={key}
              dataKey={key}
              name={key === 'value' ? t('AVERAGE') : key}
              type="monotone"
              stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
              fill={SERIES_COLORS[index % SERIES_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
              connectNulls
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

/*
const LegacyApexTimeSeriesChart = ({
  data,
  dangerLevel,
  warningLevel,
  extremeLevel,
  xDateFormat = 'h:mm a',
  yaxisTitle: yaxisTitleProp,
  unit = '',
  yAxisFormatter,
}: ChartProps) => {
  const t = useTranslations('AA_PROJECT');
  const locale = useLocale();
  const formatNum = useNumberFormat();
  const resolvedYaxisTitle = yaxisTitleProp ?? t('WATER_LEVEL_METERS');
  if (!data || data.length === 0) return null;

  const roundToOneDecimal = (value: number) => Number(roundValue(value));
  const keys = Object.keys(data[0]).filter((key) => key !== 'datetime');
  const sortedData = [...data].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );
  const series = keys.map((key) => ({
    name: key === 'value' ? t('AVERAGE') : key,
    data: sortedData.map((row) => {
      const result = convertToLocalTimeOrMillisecond(row.datetime);
      if (typeof result === 'string' || !result) {
        return [0, row[key]];
      }
      const value = Number(row[key]);
      return [
        result.timestamp,
        Number.isFinite(value) ? roundToOneDecimal(value) : value,
      ];
    }),
  }));
  const { timestamp: minTime } = convertToLocalTimeOrMillisecond(
    sortedData[0].datetime,
  ) as { timestamp: number; formatted: string };
  const { timestamp: maxTime } = convertToLocalTimeOrMillisecond(
    sortedData[sortedData.length - 1].datetime,
  ) as { timestamp: number; formatted: string };
  const allValues = data.flatMap((row) => keys.map((key) => row[key]));
  const minY = Math.min(
    ...allValues,
    Number(warningLevel ?? Infinity),
    Number(dangerLevel ?? Infinity),
    Number(extremeLevel ?? Infinity),
  );
  const maxY = Math.max(
    ...allValues,
    Number(warningLevel ?? -Infinity),
    Number(dangerLevel ?? -Infinity),
    Number(extremeLevel ?? -Infinity),
  );
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      zoom: { enabled: false },
      offsetX: 0,
      offsetY: 10,
      locales: [
        {
          name: 'app',
          options: {
            toolbar: {
              exportToSVG: t('DOWNLOAD_SVG'),
              exportToPNG: t('DOWNLOAD_PNG'),
              exportToCSV: t('DOWNLOAD_CSV'),
              download: t('CHART_MENU'),
            },
          },
        },
      ],
      defaultLocale: 'app',
    },
    xaxis: {
      type: 'datetime',
      min: minTime,
      max: maxTime,
      title: { text: t('TIME_STAMP') },
      labels: {
        formatter: (value) => formatChartDate(value, xDateFormat, locale),
        rotate: 0,
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      title: { text: resolvedYaxisTitle },
      min: minY - 0.5,
      max: maxY + 0.5,
      labels: {
        formatter: (value) => {
          const roundedValue = roundValue(Number(value));
          try {
            return yAxisFormatter
              ? yAxisFormatter(Number(roundedValue))
              : formatNum(roundedValue);
          } catch (error) {
            console.warn('yAxisFormatter threw error:', error);
            return `${roundedValue}`;
          }
        },
      },
    },
    tooltip: {
      shared: false,
      x: { formatter: (value) => formatChartDate(value, 'PPp', locale) },
      y: {
        formatter: (value) =>
          `${formatNum(roundValue(Number(value)))} ${unit}`,
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    annotations: {
      yaxis: [
        ...(warningLevel
          ? [{ y: warningLevel, borderColor: '#FFA500', label: { text: t('WARNING_LEVEL') } }]
          : []),
        ...(dangerLevel
          ? [{ y: dangerLevel, borderColor: '#FF0000', label: { text: t('DANGER_LEVEL') } }]
          : []),
        ...(extremeLevel
          ? [{ y: extremeLevel, borderColor: '#A51D1D', label: { text: t('EXTREME_LEVEL') } }]
          : []),
      ],
    },
  };
  return <ApexChart options={options} series={series} type="area" height={350} />;
};
*/

export default TimeSeriesChart;
