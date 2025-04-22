'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartProps = {
  data: Record<string, any>[]; // accepts any shape with datetime
};

const TimeSeriesChart = ({ data }: ChartProps) => {
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
    },
    yaxis: {
      title: {
        text: 'Water Level (m)',
      },
    },
    tooltip: {
      x: { format: 'dd MMM HH:mm' },
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
  };

  return (
    <ApexChart options={options} series={series} type="area" height={400} />
  );
};

export default TimeSeriesChart;
