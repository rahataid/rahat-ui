// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
  width?: number | string;
  height?: number | string;
  stacked?: boolean;
  categories?: string[];
};

export default function ChartColumnStacked({
  series,
  height = 320,
  width = 650,
  stacked = false,
  categories = ['Enrolled', 'Referred'],
}: Props) {
  const chartOptions = useChart({
    chart: {
      stacked: stacked,

      zoom: {
        enabled: true,
      },
    },
    legend: {
      itemMargin: {
        vertical: 8,
      },
      position: 'right',
      offsetY: 20,
    },
    plotOptions: {
      bar: {
        columnWidth: 30,
      },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories,
    },
  });
  return (
    <Chart
      dir="ltr"
      type="bar"
      series={series}
      options={chartOptions}
      height={height}
      width={width}
    />
  );
}
