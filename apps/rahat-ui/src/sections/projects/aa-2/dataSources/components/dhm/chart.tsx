'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import dynamic from 'next/dynamic';
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

const formatChartDate = (value: string | number, pattern: string, locale: string) => {
  const options = CHART_DATE_PATTERN_MAP[pattern] ?? CHART_DATE_PATTERN_MAP['h:mm a'];
  const neOptions = locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
  const d = new Date(value);
  const formatter = new Intl.DateTimeFormat(
    locale === 'ne' ? 'ne-NP' : locale,
    neOptions,
  );
  if (locale === 'ne' && (options.weekday || options.month)) {
    return localizeNepaliParts(d, options, formatter.formatToParts(d));
  }
  return formatter.format(d);
};

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartProps = {
  data: Record<string, any>[]; // accepts any shape with datetime
  dangerLevel?: string | number;
  warningLevel?: string | number;
  extremeLevel?: string | number;
  yaxisTitle?: string;
  unit?: string;
  xDateFormat?: string; // format for x-axis date labels
  yAxisFormatter?: (value: number) => string;
};

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
  if (!data || data.length === 0) return null;

  const roundToOneDecimal = (value: number) => Number(roundValue(value));

  const keys = Object.keys(data[0]).filter((key) => key !== 'datetime');

  const sortedData = [...data].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );

  const series = keys.map((key) => ({
    name: key === 'value' ? t('AVERAGE') : key,
          data: sortedData.map((d) => {
      const result = convertToLocalTimeOrMillisecond(d.datetime);
      if (typeof result === 'string' || !result) {
        return [0, d[key]]; // Fallback to 0 or handle error as needed
      }
      const { timestamp } = result;
      const value = Number(d[key]);
      return [
        timestamp,
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

  const allValues = data.flatMap((d) => keys.map((key) => d[key]));
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
      // The export menu is rendered by ApexCharts itself, so its labels can only
      // be translated through Apex's own `locales` option.
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
        title: {
          text: t('TIME_STAMP'),
        },
      labels: {
        formatter: function (value) {
          return formatChartDate(value, xDateFormat, locale);
        },
        rotate: 0,
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      title: {
        text: resolvedYaxisTitle,
      },
      min: minY - 0.5,
      max: maxY + 0.5,
      labels: {
        formatter: function (value) {
          const roundedValue = roundValue(Number(value));
          if (typeof yAxisFormatter === 'function') {
            try {
              return yAxisFormatter(Number(roundedValue));
            } catch (error) {
              console.warn('yAxisFormatter threw error:', error);
              return `${roundedValue}`;
            }
          }
          return formatNum(roundedValue);
        },
      },
    },
    tooltip: {
      shared: false,
      x: {
        formatter: function (value) {
          return formatChartDate(value, 'PPp', locale);
        },
      },
      y: {
        formatter: function (value) {
          return `${formatNum(roundValue(Number(value)))} ${unit}`;
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
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
          ? [
              {
                y: warningLevel,
                borderColor: '#FFA500', // orange
                label: {
                  borderColor: '#FFA500',
                  style: {
                    color: '#fff',
                    background: '#FFA500',
                  },
                  text: t('WARNING_LEVEL'),
                },
              },
            ]
          : []),
        ...(dangerLevel
          ? [
              {
                y: dangerLevel,
                borderColor: '#FF0000', // red
                label: {
                  borderColor: '#FF0000',
                  style: {
                    color: '#fff',
                    background: '#FF0000',
                  },
                  text: t('DANGER_LEVEL'),
                },
              },
            ]
          : []),
        ...(extremeLevel
          ? [
              {
                y: extremeLevel,
                borderColor: '#A51D1D', // dark red
                label: {
                  borderColor: '#A51D1D',
                  style: {
                    color: '#fff',
                    background: '#A51D1D',
                  },
                  text: t('EXTREME_LEVEL'),
                },
              },
            ]
          : []),
      ],
    },
  };

  return (
    <ApexChart options={options} series={series} type="area" height={350} />
  );
};

export default TimeSeriesChart;
