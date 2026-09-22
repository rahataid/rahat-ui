// components

import { ApexOptions } from 'apexcharts';
import merge from 'lodash/merge';
import styled from '@emotion/styled';
import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  labels: string[];
  series: ApexAxisChartSeries | ApexNonAxisChartSeries | undefined;
  donutSize?: string;
  width?: number | string;
  height?: number | string;
  showLegend?: boolean;
  colors?: string[];
  showDonutLabel?: boolean;
  options?: ApexOptions;
};

export default function ChartDonut({
  labels,
  series,
  donutSize,
  width = 230,
  height = 200,
  showLegend = true,
  colors = ['#00b67a', '#8BC34A', '#FFA726', '#007bb6', '#7a00b6'],
  showDonutLabel = false,
  options,
}: Props) {
  const baseOptions = useChart({
    colors,
    labels: labels,
    stroke: {
      show: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      show: showLegend,
    },
    tooltip: {
      fillSeriesColor: true,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: showDonutLabel,
          },
          size: donutSize,
        },
      },
    },
  });

  const chartOptions = merge(baseOptions, options);

  return (
    <Chart
      dir="ltr"
      type="donut"
      series={series}
      options={chartOptions}
      width={width}
      height={height}
      labels={['123']}
    />
  );
}
