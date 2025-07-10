'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartProps = {
  data: Record<string, any>[]; // accepts any shape with datetime
  dangerLevel?: string;
  warningLevel?: string;
  yaxisTitle?: string;
  unit?: string;
};

const TimeSeriesChart = ({
  data,
  dangerLevel,
  warningLevel,
  yaxisTitle = 'Water Level (m)',
  unit = '',
}: ChartProps) => {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]).filter((key) => key !== 'datetime');

  const series = keys.map((key) => ({
    name: key === 'value' ? 'average' : key,
    data: data.map((d) => [new Date(d.datetime).getTime(), d[key]]),
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      zoom: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      title: {
        text: 'Time Stamp',
      },
      labels: {
        formatter: function (value) {
          return format(new Date(value), 'h:mm a');
        },
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
          ) - 0.5,
      }),
      ...(dangerLevel && {
        max:
          Math.max(
            ...data.flatMap((d) => keys.map((key) => d[key])),
            Number(warningLevel),
            Number(dangerLevel),
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
      ],
    },
  };

  return (
    <ApexChart options={options} series={series} type="area" height={400} />
  );
};

export default TimeSeriesChart;
