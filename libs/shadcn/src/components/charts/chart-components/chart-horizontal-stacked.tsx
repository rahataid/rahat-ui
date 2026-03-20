import Chart from '../chart';
import useChart from '../use-chart';

// ----------------------------------------------------------------------

type Props = {
  labels: string[];
  series: number[];
  width?: number | string;
  height?: number | string;
  colors?: string[];
  showLegend?: boolean;
};

export default function ChartHorizontalStacked({
  labels,
  series,
  width = '100%',
  height = 80,
  colors = ['#297AD6', '#E8C468'],
  showLegend = true,
}: Props) {
  // ApexCharts bar (stacked) expects series as [{ name, data }]
  const apexSeries = series.map((value, i) => ({
    name: labels[i] ?? `Series ${i + 1}`,
    data: [value],
  }));

  const chartOptions = useChart({
    colors,
    chart: {
      type: 'bar',
      stacked: true,
      stackType: '100%',
    },
    stroke: { show: false },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (_val: number, opts: any) => {
        const raw =
          opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex];
        return raw > 0 ? String(raw) : '';
      },
      style: { fontSize: '11px', fontWeight: 600 },
    },
    xaxis: {
      categories: [''],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false, padding: { top: 0, bottom: 0, left: 0, right: 0 } },
    legend: {
      show: showLegend,
      position: 'bottom',
      horizontalAlign: 'center',
      markers: { size: 8 },
    },

    tooltip: {
      y: {
        formatter: (val: number) => String(val),
      },
    },
  });

  return (
    <Chart
      dir="ltr"
      type="bar"
      series={apexSeries}
      options={chartOptions}
      width={width}
      height={height}
    />
  );
}
