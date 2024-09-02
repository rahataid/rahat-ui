import styled from '@emotion/styled';
import { ApexOptions } from 'apexcharts';
import { fNumber } from '../../../utils/fNumber';
import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;
const DIVIDER_COLOR = '#000000'; // Replace with your desired color

const StyledChart = styled(Chart)({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${DIVIDER_COLOR}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
});

const CommunityStyledChart = styled(Chart)({
  height: 300,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: 50,
    top: `calc(${300 - 50}px) !important`,
  },
});

// ----------------------------------------------------------------------

interface Props {
  custom?: boolean;
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ApexOptions;
  };
  communityTool?: boolean;
  donutSize?: string;
  width?: number;
  height?: number;
}

export default function PieChart({
  custom = false,
  title,
  subheader,
  chart,
  communityTool = false,
  donutSize = '90%',
  width = 400,
  height = 320,
}: Props) {
  const {
    colors = ['#00b67a', '#8BC34A', '#FFA726', '#007bb6', '#7a00b6'],
    series = [],
    options = {},
  } = chart;
  const chartSeries = series.map((i) => i.value);
  const chartOptions = useChart({
    chart: {
      // sparkline: {
      //   enabled: true,
      // },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: communityTool ? ['none'] : [colors[5]], show: false },
    legend: {
      offsetY: 0,
      floating: false,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
    },
    tooltip: {
      fillSeriesColor: true,
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: donutSize,
          labels: {
            show: communityTool ? false : true,
            value: {
              formatter: (value: number | string) => fNumber(value),
            },
            total: {
              show: communityTool ? false : true,
              formatter: (w: { globals: { seriesTotals: number[] } }) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: communityTool ? false : true,
    },
    ...options,
  });

  return custom ? (
    <Chart
      dir="ltr"
      type="pie"
      series={chartSeries}
      options={chartOptions}
      height={height}
      width={width}
    />
  ) : (
    <div>
      {communityTool ? (
        <div className="bg-card shadow-md rounded-lg p-4 ">
          <h2 className={`font-medium  text-left`}>{title}</h2>
          <div className="flex flex-col items-center justify-center">
            <CommunityStyledChart
              dir="ltr"
              type="pie"
              series={chartSeries}
              options={chartOptions}
              height={320}
              width={350}
            />
          </div>
        </div>
      ) : (
        <div className="bg-card shadow-md rounded-lg p-4 flex items-center justify-center">
          <div className="rounded-lg overflow-hidden p-4">
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className={`font-medium p-0 text-left`}>{title}</h2>
              <Chart
                dir="ltr"
                type="pie"
                series={chartSeries}
                options={chartOptions}
                height={height}
                width={width}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
