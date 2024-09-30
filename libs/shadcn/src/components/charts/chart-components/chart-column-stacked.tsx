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
};

export default function ChartColumnStacked({
  series,
  height = 320,
  width = 575,
  stacked = false,
  categories = ['Enrolled', 'Referred'],
  communityTool = false,
}: Props) {
  const chartOptions = useChart({
    chart: {
      stacked: stacked,
      height: '50px',

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
        columnWidth: '50px',
        borderRadius: 4,
        borderRadiusApplication: 'end',
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
    <div
      className={`${
        !communityTool && 'bg-white shadow-md rounded-lg overflow-hidden p-4'
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
