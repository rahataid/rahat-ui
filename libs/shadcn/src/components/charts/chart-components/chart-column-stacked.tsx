// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartColumnStacked({ series }: Props) {
  const chartOptions = useChart({
    chart: {
      stacked: false,
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
        columnWidth: '50%',
      },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: ['Enrolled', 'Referred'],
    },
  });

  return (
    <Chart
      dir="ltr"
      type="bar"
      series={series}
      options={chartOptions}
      height={320}
    />
  );
}
