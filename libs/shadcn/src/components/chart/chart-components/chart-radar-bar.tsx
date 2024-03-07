// @mui
// components

import styled from '@emotion/styled';
import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 380;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(() => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    marginBottom: 3,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartRadarBar({ series }: Props) {
  const chartOptions = useChart({
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.48,
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    xaxis: {
      categories: ['2011', '2012', '2013', '2014', '2015', '2016'],
      labels: {
        style: {
          colors: [
            'rgba(0,0,0,0.87)',
            'rgba(0,0,0,0.87)',
            'rgba(0,0,0,0.87)',
            'rgba(0,0,0,0.87)',
          ],
        },
      },
    },
  });

  return (
    <StyledChart
      dir="ltr"
      type="radar"
      series={series}
      options={chartOptions}
      height={280}
    />
  );
}
