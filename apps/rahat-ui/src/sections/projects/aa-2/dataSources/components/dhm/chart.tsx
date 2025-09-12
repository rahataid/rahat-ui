'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartProps = {
  data: Record<string, any>[]; // accepts any shape with datetime
  dangerLevel?: string | number;
  warningLevel?: string | number;
  extremeLevel?: string | number;
  yaxisTitle?: string;
  unit?: string;
  xDateFormat?: string; // format for x-axis date labels
};

const TimeSeriesChart = ({
  data,
  dangerLevel,
  warningLevel,
  extremeLevel,
  xDateFormat = 'h:mm a',
  yaxisTitle = 'Water Level (m)',
  unit = '',
}: ChartProps) => {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]).filter((key) => key !== 'datetime');

  const sortedData = [...data].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
  );

  // const series = keys.map((key) => ({
  //   name: key === 'value' ? 'average' : key,
  //   data: sortedData.map((d) => [new Date(d.datetime).getTime(), d[key]]),
  // }));
  const series = keys.map((key) => ({
    name: key === 'value' ? 'average' : key,
    data: sortedData.map((d) => {
      const result = convertToLocalTimeOrMillisecond(d.datetime);
      if (typeof result === 'string' || !result) {
        return [0, d[key]]; // Fallback to 0 or handle error as needed
      }
      const { timestamp } = result;
      return [timestamp, d[key]];
    }),
  }));
  console.log(series, 'series');

  //const minTime = new Date(sortedData[0].datetime).getTime();
  const { timestamp: minTime } = convertToLocalTimeOrMillisecond(
    sortedData[0].datetime,
  ) as { timestamp: number; formatted: string };
  console.log(minTime, 'minTime');
  // const maxTime = new Date(
  //   sortedData[sortedData.length - 1].datetime,
  // ).getTime();
  const { timestamp: maxTime } = convertToLocalTimeOrMillisecond(
    sortedData[sortedData.length - 1].datetime,
  ) as { timestamp: number; formatted: string };
  console.log(maxTime, 'maxTime');

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
          console.log(value, 'inside apex function');
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
      ...(warningLevel && {
        min:
          Math.min(
            ...data.flatMap((d) => keys.map((key) => d[key])),
            Number(warningLevel),
            Number(dangerLevel),
            Number(extremeLevel),
          ) - 0.5,
      }),
      ...(dangerLevel && {
        max:
          Math.max(
            ...data.flatMap((d) => keys.map((key) => d[key])),
            Number(warningLevel),
            Number(dangerLevel),
            Number(extremeLevel),
          ) + 0.5,
      }),
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
          return `${value} ${unit}`;
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
    <ApexChart options={options} series={series} type="area" height={400} />
  );
};

export default TimeSeriesChart;
