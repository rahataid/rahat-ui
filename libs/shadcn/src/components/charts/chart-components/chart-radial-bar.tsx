// @mui
// utils
// components
import styled from '@emotion/styled';
import Chart, { useChart } from 'src/components/chart';
import { fNumber } from '../../../utils/fNumber';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 380;

const LEGEND_HEIGHT = 72;

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
};

export default function ChartRadialBar({ series }: Props) {
  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: ['Apples', 'Oranges'],
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '68%',
        },
        dataLabels: {
          value: {
            offsetY: 16,
          },
          total: {
            formatter: () => fNumber(2324),
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
      height={280}
    />
  );
}
