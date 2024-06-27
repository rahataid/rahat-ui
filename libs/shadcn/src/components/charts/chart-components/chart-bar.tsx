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
  xaxisLabels?: boolean;
  yaxisLabels?: boolean;
  barHeight?: number;
};

export default function ChartBar({
  series,
  categories,
  width = 400,
  height = 400,
  horizontal = false,
  colors = ['#007BFF'],
  xaxisLabels = true,
  yaxisLabels = true,
  barHeight = 20,
}: Props) {
  const chartOptions = useChart({
    colors,
    stroke: { show: false },
    chart: {
      type: 'bar',
      height: 500,
    },

    plotOptions: {
      bar: {
        horizontal: horizontal,
        barHeight: barHeight,
        columnWidth: '12%',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    xaxis: {
      categories,
      labels: {
        show: xaxisLabels,
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
    yaxis: {
      labels: { show: yaxisLabels },
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
