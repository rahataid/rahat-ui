// Shared ApexCharts donut options: slices show counts, the tooltip and the
// centre value on hover show the percentage, and the centre total shows the
// overall count. Pass the result as `options` to the shadcn PieChart.

type ApexFormatterOpts = {
  seriesIndex?: number;
  w?: {
    globals?: {
      series?: number[];
      seriesTotals?: number[];
    };
    config?: {
      series?: number[];
    };
  };
};

export function buildDonutOptions(
  formatNum: (v: number | string) => string,
  totalLabel: string,
  total: number,
) {
  return {
    dataLabels: {
      enabled: true,
      formatter: (_val: number | string, opts?: ApexFormatterOpts) => {
        const seriesIdx = opts?.seriesIndex ?? 0;
        const num =
          opts?.w?.globals?.series?.[seriesIdx] ??
          opts?.w?.config?.series?.[seriesIdx];
        if (num === undefined || num === null || num === 0) return '';
        return formatNum(num);
      },
    },
    tooltip: {
      fillSeriesColor: true,
      y: {
        formatter: (val: number, opts?: ApexFormatterOpts) => {
          const sum =
            opts?.w?.globals?.seriesTotals?.reduce(
              (a: number, b: number) => a + b,
              0,
            ) || total;
          const pct = sum > 0 ? ((val / sum) * 100).toFixed(1) : '0';
          return `${formatNum(pct)}%`;
        },
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            value: {
              formatter: (val: number | string, opts?: ApexFormatterOpts) => {
                const num = Number(val);
                const sum =
                  opts?.w?.globals?.seriesTotals?.reduce(
                    (a: number, b: number) => a + b,
                    0,
                  ) || total;
                const pct = sum > 0 ? ((num / sum) * 100).toFixed(1) : '0';
                return `${formatNum(pct)}%`;
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
