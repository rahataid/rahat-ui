// components

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
};

export default function ChartDonut({
  labels,
  series,
  donutSize,
  width = 230,
  height = 200,
}: Props) {
  const chartOptions = useChart({
    labels: labels,
    stroke: {
      show: false,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
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
            show: false,
          },
          size: donutSize,
        },
      },
    },
  });

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
