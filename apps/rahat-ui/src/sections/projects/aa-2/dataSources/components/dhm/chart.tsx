'use client';

import React from 'react';
import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartProps = {
  series: ApexAxisChartSeries;
};

const TimeSeriesChart = ({ series }: ChartProps) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'line',
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
  };

  return (
    <ApexChart options={options} series={series} type="line" height={400} />
  );
};

export default TimeSeriesChart;
