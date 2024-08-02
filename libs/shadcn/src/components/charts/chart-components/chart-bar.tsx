// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  ctSeries?: number[];
  ctCategories?: string[];
  width?: number | string;
  height?: number | string;
  horizontal?: boolean;
  colors?: string[];
  xaxisLabels?: boolean;
  yaxisLabels?: boolean;
  barHeight?: number;
  actualData?: any;
  component?: any;
  communityTool?: boolean;
};

export default function ChartBar({
  width = 400,
  height = 400,
  horizontal = false,
  colors = ['#007BFF'],
  xaxisLabels = true,
  yaxisLabels = true,
  barHeight = 20,
  actualData,
  component,
  ctSeries,
  ctCategories,
  communityTool = false,
}: Props) {
  const barData = actualData?.find((d: any) => d.name === component?.dataMap);

  const categories = barData?.data.map((b: any) => b.id);
  const series = barData?.data.map((b: any) => b.count);

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
      categories: communityTool ? ctCategories : categories,
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
    tooltip: {
      x: {
        show: true,
      },
    },
  });

  return (
    <Chart
      dir="ltr"
      type="bar"
      series={[
        {
          data: communityTool ? ctSeries : series,
        },
      ]}
      options={chartOptions}
      height={height}
      width={width}
    />
  );
}
