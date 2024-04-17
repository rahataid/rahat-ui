// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  series: number[];
  categories: string[];
};

export default function ChartBar({ series, categories = [] }: Props) {
  const chartOptions = useChart({
    stroke: { show: false },
    plotOptions: {
      bar: { horizontal: true, barHeight: '30%' },
    },
    xaxis: {
      categories,
    },
  });

  return (
    <Chart
      dir="ltr"
      type="bar"
      series={[
        {
          data: series,
        },
      ]}
      options={chartOptions}
      height={320}
    />
  );
}
