// components

import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  lineChartOptions?: ApexCharts.ApexOptions;
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartLine({ series, lineChartOptions }: Props) {
  const defaultOptions = {
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
      ],
    },
    tooltip: {
      x: {
        show: false,
      },
      marker: { show: false },
    },
    dataLabels: {
      enabled: true,
    },
  };

  const options = lineChartOptions ? lineChartOptions : defaultOptions;

  const chartOptions = useChart(options);

  return (
    <Chart
      dir="ltr"
      type="line"
      series={series}
      options={chartOptions}
      height={'100%'}
      width={'100%'}
    />
  );
}
