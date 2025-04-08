// components/ZoomableLineChart.tsx
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type ZoomableLineChartProps = {
  series: { name: string; data: [number, number][] }[];
  title?: string;
};

const ZoomableLineChart: React.FC<ZoomableLineChartProps> = ({
  series,
  title = 'Zoomable Line Chart',
}) => {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      zoom: { enabled: true },
      toolbar: { autoSelected: 'zoom' },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    title: {
      text: title,
      align: 'left',
    },
    xaxis: { type: 'datetime' },
    tooltip: {
      x: { format: 'dd MMM yyyy' },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default ZoomableLineChart;
