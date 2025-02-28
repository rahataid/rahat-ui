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
  categories?: any;
  series?: any;
  communityTool?: boolean;
  custom?: boolean;
  title?: string;
};

export default function ChartBar({
  width = 400,
  height = 400,
  horizontal = false,
  colors = ['#007BFF'],
  xaxisLabels = true,
  yaxisLabels = true,
  barHeight = 25,
  categories,
  series,
  ctSeries,
  ctCategories = [],
  communityTool = false,
  custom = false,
  title = '',
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
        columnWidth: '50px',
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },
    xaxis: {
      categories: communityTool ? ctCategories : categories,
      labels: {
        show:
          (ctCategories?.length > 0 ? xaxisLabels : false) ||
          (categories?.length > 0 && xaxisLabels),
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
      labels: {
        show:
          (ctCategories?.length > 0 ? yaxisLabels : false) ||
          (categories?.length > 0 && yaxisLabels),
      },
    },
    tooltip: {
      x: {
        show: true,
      },
    },
  });

  return !custom ? (
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
  ) : (
    <div className="p-4 border rounded-md shadow">
      <p className="font-semibold text-sm/6 text-muted-foreground">{title}</p>
      <div className="flex justify-center">
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
      </div>
    </div>
  );
}
