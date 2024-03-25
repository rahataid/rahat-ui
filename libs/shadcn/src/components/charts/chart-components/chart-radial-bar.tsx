// @mui
// utils
// components
import styled from '@emotion/styled';
import Chart, { useChart } from '..';
import { fNumber } from '../../../utils/fNumber';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 180;

const LEGEND_HEIGHT = 22;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    marginBottom: 2,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  series: number[];
  total: number;
};

export default function ChartRadialBar({ series, total }: Props) {
  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    // labels: ['Apples', 'Oranges'],
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '58%',
        },
        dataLabels: {
          value: {
            offsetY: 10,
          },
          total: {
            formatter: () => fNumber(total),
          },
        },
      },
    },
  });

  return (
    <StyledChart
      dir="ltr"
      type="radialBar"
      series={series}
      options={chartOptions}
      height={100}
    />
  );
}
