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
  communityTool?: boolean;
  custom?: boolean;
  options?: ApexCharts.ApexOptions;
};

export default function ChartColumnStacked({
  series,
  height = 320,
  width = 575,
  stacked = false,
  categories = ['Enrolled', 'Referred'],
  communityTool = false,
  custom = false,
  options = {},
}: Props) {
  const catCount = categories?.length || 1;
  const seriesCount = stacked ? 1 : series?.length || 1;

  const columnWidth =
    catCount <= 2
      ? stacked || seriesCount === 1
        ? '40%'
        : '60%'
      : catCount === 3
      ? '75%'
      : '82%';

  const chartOptions = useChart({
    chart: {
      stacked: stacked,
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
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
        columnWidth,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        hideZeroBarsWhenGrouped: true,
      },
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth,
            },
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          plotOptions: {
            bar: {
              columnWidth,
            },
          },
        },
      },
    ],
    ...options,
  });
  return (
    <div
      className={`${
        !communityTool &&
        !custom &&
        'bg-white shadow-md rounded-lg overflow-hidden p-4'
      }`}
    >
      <Chart
        dir="ltr"
        type="bar"
        series={series}
        options={chartOptions}
        height={height}
        width={width}
      />
    </div>
  );
}
