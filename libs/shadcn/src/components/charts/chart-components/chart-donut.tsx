// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  labels: string[];
  series: number[];
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
      horizontalAlign: 'left',
    },
    tooltip: {
      fillSeriesColor: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
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
    />
  );
}
