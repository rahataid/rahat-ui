// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  series: number[];
  categories: string[];
  width?: number | string;
  height?: number | string;
  horizontal?: boolean;
  colors?: string[];
};

export default function ChartBar({
  series,
  categories,
  width = 400,
  height = 400,
  horizontal = false,
  colors = ['#007BFF'],
}: Props) {
  const chartOptions = useChart({
    colors,
    stroke: { show: false },
    chart: {
      type: 'bar',
      height: 400,
    },

    plotOptions: {
      bar: {
        horizontal: horizontal,
        barHeight: 20,
        columnWidth: '12%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    xaxis: {
      categories,
      labels: {
        show: true,
        formatter: (value: string) => value,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E9FF',
            colorTo: '#BED2FF',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
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
      height={height}
      width={width}
    />
  );
}
