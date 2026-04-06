'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';
import { roundValue } from '../aws/utils/color.utils';

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
  yaxisTitle = 'Water Level (m)',
  unit = '',
  yAxisFormatter,
}: ChartProps) => {
  if (!data || data.length === 0) return null;

  const roundToOneDecimal = (value: number) => Number(roundValue(value));

  const keys = Object.keys(data[0]).filter((key) => key !== 'datetime');

  const sortedData = [...data].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );

  const series = keys.map((key) => ({
    name: key === 'value' ? 'average' : key,
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
    },
    xaxis: {
      type: 'datetime',
      min: minTime,
      max: maxTime,
      title: {
        text: 'Time Stamp',
      },
      labels: {
        formatter: function (value) {
          return format(new Date(value), xDateFormat);
        },
        rotate: 0,
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      title: {
        text: yaxisTitle,
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
          return `${roundedValue}`;
        },
      },
    },
    tooltip: {
      shared: false,
      x: {
        formatter: function (value) {
          return format(new Date(value), 'PPp');
        },
      },
      y: {
        formatter: function (value) {
          return `${roundValue(Number(value))} ${unit}`;
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
                  text: 'Warning Level',
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
                  text: 'Danger Level',
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
                  text: 'Extreme Level',
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
