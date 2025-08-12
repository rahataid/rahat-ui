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
  barHeight?: number | string | undefined;
  categories?: any;
  series?: any;
  communityTool?: boolean;
  custom?: boolean;
  title?: string;
  xaxisTitle?: string;
  yaxisTitle?: string;
  columnWidth?: string | number | undefined;
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
  xaxisTitle = ' ',
  yaxisTitle = ' ',
  columnWidth = '50%',
}: Props) {
  const chartOptions = useChart({
    colors,
    stroke: { show: false },
    chart: {
      type: 'bar',
      height: '100%',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        horizontal: horizontal,
        barHeight: barHeight,
        columnWidth: columnWidth,
        borderRadius: 4,
        borderRadiusApplication: 'end',
      },
    },

    xaxis: {
      title: {
        text: `${xaxisTitle}`,
        style: {
          fontSize: '12px',
          fontWeight: 600,
        },
      },

      categories: communityTool ? ctCategories : categories,
      labels: {
        show:
          (ctCategories?.length > 0 ? xaxisLabels : false) ||
          (categories?.length > 0 && xaxisLabels),
        formatter: (value: string) => value,
        trim: true,
        rotate: 0,
        hideOverlappingLabels: false,
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
      title: {
        text: yaxisTitle,
        style: {
          fontSize: '12px',
          fontWeight: 600,
        },
      },
      labels: {
        show:
          (ctCategories?.length > 0 ? yaxisLabels : false) ||
          (categories?.length > 0 && yaxisLabels),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
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
          name: '',
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
              name: '',
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
