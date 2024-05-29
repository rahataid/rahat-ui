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
};

export default function ChartBar({
  series,
  categories,
  width = 400,
  height = 400,
  horizontal = false,
}: Props) {
  const chartOptions = useChart({
    stroke: { show: false },
    chart: {
      type: 'bar',
      height: 350,
    },

    plotOptions: {
      bar: {
        horizontal: horizontal,
        barHeight: '60%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    xaxis: {
      categories,
      labels: {
        show: true,
      },
      axisBorder: {
        show: true,
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
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}`,
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
