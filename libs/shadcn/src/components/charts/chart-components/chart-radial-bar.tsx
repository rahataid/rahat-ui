// @mui
// utils
// components
import styled from '@emotion/styled';
import Chart, { useChart } from '..';
import { fNumber } from '../../../utils/fNumber';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 150;

const LEGEND_HEIGHT = 30;

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
  label: string;
};

export default function ChartRadialBar({ series, total, label }: Props) {
  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: [label],
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '60%',
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
      height={110}
      width={130}
    />
  );
}
