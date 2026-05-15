import { LineChart } from '@rahat-ui/shadcn/src/components/charts';
import type { ApexOptions } from 'apexcharts';

type LineChartData = {
  series: number[];
  categories: string[];
  name: string;
};

/** Aligns with `APP.REPORT_LABELS` in rahat-project-cambodia (chart report titles). */
const Y_AXIS_LABEL_BY_REPORT: Record<string, string> = {
  'Villagers Referred': 'Villagers referred (count)',
  'Total purchase amount in EP (in RMB)': 'Purchase amount (RMB)',
  'Successful referrals in EP': 'Successful referrals (count)',
  'Total number of villagers in EP': 'Cumulative villagers in EP (count)',
};

const AXIS_LABEL_STYLE = {
  colors: '#6b7280',
  fontSize: '12px',
  fontWeight: 400,
} as const;

const AXIS_TITLE_STYLE = {
  color: '#374151',
  fontSize: '12px',
  fontWeight: 600,
} as const;

function yAxisTitleForReport(chartTitle: string): string {
  if (Y_AXIS_LABEL_BY_REPORT[chartTitle]) {
    return Y_AXIS_LABEL_BY_REPORT[chartTitle];
  }
  const n = chartTitle.toLowerCase();
  if (n.includes('rmb') || n.includes('purchase amount')) {
    return 'Purchase amount (RMB)';
  }
  if (n.includes('successful referral')) {
    return 'Successful referrals (count)';
  }
  if (n.includes('villagers referred')) {
    return 'Villagers referred (count)';
  }
  if (
    n.includes('total number of villagers') ||
    (n.includes('villagers') && n.includes('ep') && n.includes('cumulative'))
  ) {
    return 'Cumulative villagers in EP (count)';
  }
  return 'Value';
}

function lineOptionsForCambodia(chartTitle: string): ApexOptions {
  const yTitle = yAxisTitleForReport(chartTitle);

  return {
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      y: { title: { formatter: () => '' } },
    },
    xaxis: {
      title: {
        text: 'Week',
        offsetY: 4,
        style: AXIS_TITLE_STYLE,
      },
      labels: { style: AXIS_LABEL_STYLE },
    },
    yaxis: {
      title: {
        text: yTitle,
        style: AXIS_TITLE_STYLE,
      },
      labels: { style: AXIS_LABEL_STYLE },
    },
  };
}

const CambodiaLineCharts = ({ series, categories, name }: LineChartData) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm shadow-black/[0.03]">
      <div className="border-b border-border/80 px-5 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {name}
        </h2>
      </div>
      <div className="h-64 px-5 pb-5 pt-3">
        <LineChart
          series={[{ name, data: series }]}
          categories={categories}
          lineChartOptions={lineOptionsForCambodia(name)}
        />
      </div>
    </div>
  );
};

export default CambodiaLineCharts;
