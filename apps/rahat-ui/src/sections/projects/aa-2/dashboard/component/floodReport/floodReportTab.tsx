'use client';

import {
  BarChart,
  ChartColumnStacked,
} from '@rahat-ui/shadcn/src/components/charts';
import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import {
  useChartNumberOptions,
  useLabelDigits,
} from 'apps/rahat-ui/src/utils/i18n/number';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useTranslations } from 'next-intl';
import DynamicPieChart from '../../../../components/dynamicPieChart';
import { ReportChart, ReportTab } from './config';

type Bucket = { id: string; count: number };
type Series = { name: string; data: number[] };
type Report = {
  total: number;
  answered: number;
  multi: boolean;
  buckets: Bucket[];
  categories: string[];
  series: Series[];
};

const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const list = (v: unknown): any[] => (Array.isArray(v) ? v : []);

// Stats come from the DB as untyped JSON: coerce everything so a malformed
// or partial row renders as "no chart" instead of throwing.
function readReport(stat: any): Report | null {
  const d = stat?.data;
  if (!d || typeof d !== 'object') return null;
  const report: Report = {
    total: num(d.total),
    answered: num(d.answered),
    multi: d.multi === true,
    buckets: list(d.buckets)
      .filter((b) => b && b.id !== undefined)
      .map((b) => ({ id: String(b.id), count: num(b.count) })),
    categories: list(d.categories).map(String),
    series: list(d.series)
      .filter((s) => s && s.name !== undefined)
      .map((s) => ({ name: String(s.name), data: list(s.data).map(num) })),
  };
  const empty = !report.buckets.length && !report.series.length;
  return empty || !report.answered ? null : report;
}

const PALETTE = [
  '#4A90E2',
  '#00796B',
  '#F5A623',
  '#9B59B6',
  '#F06292',
  '#26A69A',
  '#8D6E63',
  '#5C6BC0',
  '#FFB300',
  '#EF5350',
  '#7CB342',
  '#AB47BC',
  '#29B6F6',
  '#FF7043',
  '#78909C',
];
const FIXED_COLORS: Record<string, string> = {
  YES: '#00796B',
  NO: '#F5A623',
  MALE: '#4A90E2',
  FEMALE: '#F06292',
  UNKNOWN: '#CFD8DC',
  OTHERS: '#90A4AE',
};
const colorsFor = (ids: string[]) => {
  let next = 0;
  return ids.map((id) => FIXED_COLORS[id] ?? PALETTE[next++ % PALETTE.length]);
};

export const findStat = (benefStats: any[], name: string) =>
  readReport(list(benefStats).find((s) => s?.name === name));

export const hasReportData = (tab: ReportTab, benefStats: any[]) =>
  tab.charts.some((c) => findStat(benefStats, c.stat));

function Chart({ chart, report }: { chart: ReportChart; report: Report }) {
  const t = useTranslations('FLOOD_REPORT');
  const { formatNum } = useChartNumberOptions();
  const formatLabel = useLabelDigits();
  const label = (id: string) =>
    formatLabel(translateValue(t, id, { fallbackStyle: 'raw', silent: true }));
  const pct = (n: number) => {
    const base = report.multi ? report.answered : report.total;
    return base ? ` (${Math.round((n / base) * 100)}%)` : '';
  };
  const subtitle = [
    t('HOUSEHOLDS_ANSWERED', {
      total: formatNum(report.total),
      answered: formatNum(report.answered),
    }),
    report.multi && t('MULTIPLE_RESPONSES'),
  ]
    .filter(Boolean)
    .join(' · ');

  if (chart.kind === 'kpi') {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-sm font-medium">{t(chart.title)}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {report.buckets.map((b) => (
            <DataCard
              key={b.id}
              title={label(b.id)}
              number={formatNum(b.count)}
              className="rounded-sm w-full"
            />
          ))}
        </div>
      </div>
    );
  }

  const ids = report.buckets.map((b) => b.id);
  const counts = report.buckets.map((b) => b.count);
  const tooltip = {
    y: { formatter: (v: number) => `${formatNum(v)}${pct(v)}` },
  };
  const horizontal = chart.kind === 'hbar';
  // `any`: Apex passes numbers or strings depending on axis and orientation.
  const valueAxis = { labels: { formatter: (v: any) => formatNum(v) } };
  const categoryAxis = { labels: { formatter: (v: any) => formatLabel(v) } };

  let body: React.ReactNode;
  if (chart.kind === 'donut') {
    body = (
      <DynamicPieChart
        pieData={report.buckets.map((b) => ({
          label: label(b.id),
          value: b.count,
        }))}
        colors={colorsFor(ids)}
        options={{ tooltip }}
      />
    );
  } else if (chart.kind === 'bar' || horizontal) {
    body = (
      <BarChart
        series={counts}
        categories={ids.map(label)}
        horizontal={horizontal}
        xaxisLabels
        yaxisLabels
        barHeight={horizontal ? '60%' : 20}
        height="100%"
        width="100%"
        yaxisTitle={horizontal ? ' ' : t('HOUSEHOLDS')}
        xaxisTitle={horizontal ? t('HOUSEHOLDS') : ' '}
        columnWidth="30%"
        options={{
          colors: colorsFor(ids),
          plotOptions: { bar: { distributed: true } },
          legend: { show: false },
          tooltip,
          xaxis: horizontal ? valueAxis : categoryAxis,
          yaxis: horizontal ? categoryAxis : valueAxis,
        }}
      />
    );
  } else {
    const names = report.series.map((s) => s.name);
    body = (
      <ChartColumnStacked
        series={report.series.map((s) => ({
          name: label(s.name),
          data: s.data,
        }))}
        categories={report.categories.map(label)}
        stacked={chart.kind === 'stacked'}
        height="100%"
        width="100%"
        custom
        options={{
          colors: colorsFor(names),
          tooltip: { y: { formatter: (v: number) => formatNum(v) } },
          yaxis: valueAxis,
          legend: { position: 'bottom', offsetY: 0 },
        }}
      />
    );
  }

  return (
    <>
      <h1 className="text-sm font-medium">{t(chart.title)}</h1>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <div className="flex-1 p-2 min-h-[260px]">{body}</div>
    </>
  );
}

export default function FloodReportTab({
  tab,
  benefStats,
}: {
  tab: ReportTab;
  benefStats: any[];
}) {
  const t = useTranslations('FLOOD_REPORT');
  const charts = tab.charts
    .map((chart) => ({ chart, report: findStat(benefStats, chart.stat) }))
    .filter((c): c is { chart: ReportChart; report: Report } => !!c.report);

  return (
    <div className="flex flex-col">
      <Heading
        title={t(tab.title)}
        titleStyle="text-lg"
        description={t('SURVEY_2026_DESCRIPTION')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {charts.map(({ chart, report }) => (
          <div
            key={chart.stat}
            className={`border rounded-sm p-2 flex flex-col min-h-[200px] ${
              chart.kind === 'kpi' || chart.wide ? 'lg:col-span-2' : ''
            } ${chart.kind === 'kpi' ? '' : 'sm:min-h-[340px]'}`}
          >
            <Chart chart={chart} report={report} />
          </div>
        ))}
      </div>
    </div>
  );
}
