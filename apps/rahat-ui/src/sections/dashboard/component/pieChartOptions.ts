import type { ApexOptions } from 'apexcharts';

export function buildDashboardPieChartOptions(
  chartOptions: ApexOptions,
  formatNum: (value: number | string) => string,
  totalLabel: string,
  total: number,
): ApexOptions {
  return {
    ...chartOptions,
    dataLabels: {
      enabled: true,
      formatter: (_percentage, opts) => {
        const value = opts?.w?.globals?.series?.[opts?.seriesIndex];
        return value === undefined ? '' : formatNum(value);
      },
    },
    tooltip: {
      ...chartOptions.tooltip,
      fillSeriesColor: true,
      y: { formatter: (value) => formatNum(value) },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              formatter: (value) => {
                const percentage =
                  total > 0 ? (Number(value) / total) * 100 : 0;
                return `${formatNum(percentage.toFixed(1))}%`;
              },
            },
            total: {
              show: true,
              label: totalLabel,
              formatter: () => formatNum(total),
            },
          },
        },
      },
    },
  };
}
