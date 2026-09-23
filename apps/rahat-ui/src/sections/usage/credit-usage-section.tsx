'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  differenceInCalendarDays,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import { DemoTable } from '../../common/table';
import { useCreditColumns, CreditRow } from './useCreditColumns';
import UsageFilters from './usage-filters';

type CreditData = {
  date: string;
  transportCuid: string;
  transportName: string;
  transportType: string;
  credits: number;
  sessions: number;
  broadcasts: number;
  sessionCuids: string[];
};

type CreditUsageSectionProps = {
  credits?: CreditData[];
  loading?: boolean;
  xref: string | null;
  onXrefChange: (xref: string | null) => void;
  onDateChange: (dateRange: { from?: string; to?: string }) => void;
  onDateClear: () => void;
};

type Granularity = 'day' | 'week' | 'month';

const LABEL_PATTERN: Record<Granularity, string> = {
  day: 'MMM dd',
  week: 'MMM dd',
  month: 'MMM yyyy',
};

function pickGranularity(spanInDays: number): Granularity {
  if (spanInDays <= 31) return 'day';
  if (spanInDays <= 180) return 'week';
  return 'month';
}

function bucketStart(date: Date, granularity: Granularity) {
  if (granularity === 'month') return startOfMonth(date);
  if (granularity === 'week') return startOfWeek(date);
  return date;
}

function transformCreditsForChart(
  credits: CreditData[],
  formatDate: (date: string | Date, pattern?: string) => string,
  g: Parameters<typeof translateValue>[0],
) {
  const times = credits.map((item) => new Date(item.date).getTime());
  const spanInDays = times.length
    ? differenceInCalendarDays(
        new Date(times.reduce((a, b) => Math.max(a, b))),
        new Date(times.reduce((a, b) => Math.min(a, b))),
      )
    : 0;
  const granularity = pickGranularity(spanInDays);

  // Bucket by ISO date: it sorts chronologically as a plain string and stays
  // locale-independent. The display label is derived separately, because a
  // localised label ("जुल ०१") cannot be parsed back into a Date to sort by.
  const dateMap = new Map<string, Map<string, number>>();
  const bucketDates = new Map<string, Date>();
  const transportNames = new Set<string>();

  credits.forEach((item) => {
    const bucket = bucketStart(new Date(item.date), granularity);
    const dateKey = format(bucket, 'yyyy-MM-dd');
    bucketDates.set(dateKey, bucket);
    transportNames.add(item.transportName);

    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, new Map());
    }
    const transportMap = dateMap.get(dateKey)!;
    transportMap.set(
      item.transportName,
      (transportMap.get(item.transportName) ?? 0) + item.credits,
    );
  });

  const sortedDates = Array.from(dateMap.keys()).sort();
  const transports = Array.from(transportNames);

  const series = transports.map((name) => ({
    name: translateValue(g, name),
    data: sortedDates.map((date) => dateMap.get(date)?.get(name) ?? 0),
  }));

  return {
    categories: sortedDates.map((d) =>
      formatDate(bucketDates.get(d)!, LABEL_PATTERN[granularity]),
    ),
    series,
  };
}

export default function CreditUsageSection({
  credits,
  loading,
  xref,
  onXrefChange,
  onDateChange,
  onDateClear,
}: CreditUsageSectionProps) {
  const t = useTranslations('USAGE');
  const g = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const creditColumns = useCreditColumns();
  const chartData = useMemo(
    () => transformCreditsForChart(credits ?? [], formatDate, g),
    [credits, formatDate, g],
  );

  const showDataLabels = chartData.categories.length <= 15;

  const tableData: CreditRow[] = useMemo(
    () =>
      (credits ?? []).map((c) => ({
        date: c.date,
        transportName: c.transportName,
        transportType: c.transportType,
        credits: c.credits,
        sessions: c.sessions,
        broadcasts: c.broadcasts,
      })),
    [credits],
  );

  const table = useReactTable({
    data: tableData,
    columns: creditColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">
          {t('CREDIT_CONSUMPTION')}
        </CardTitle>
        <UsageFilters
          selectedXref={xref}
          onXrefChange={onXrefChange}
          onDateChange={onDateChange}
          onDateClear={onDateClear}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {chartData.series.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('CREDITS_OVER_TIME')}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartLine
                series={chartData.series}
                categories={chartData.categories}
                lineChartOptions={{
                  // Supplying this replaces ChartLine's own defaults, so they
                  // are restated here alongside the localised formatters.
                  xaxis: {
                    categories: chartData.categories,
                    tickAmount: Math.min(chartData.categories.length, 12),
                    labels: {
                      rotate: -45,
                      rotateAlways: false,
                      hideOverlappingLabels: true,
                    },
                  },
                  tooltip: {
                    x: { show: !showDataLabels },
                    marker: { show: false },
                    y: { formatter: (val: number) => formatNum(val) },
                  },
                  dataLabels: {
                    enabled: showDataLabels,
                    formatter: (val: number | string) => formatNum(val),
                  },
                  yaxis: {
                    labels: { formatter: (val: number) => formatNum(val) },
                  },
                }}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('DAILY_CREDIT_BREAKDOWN')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DemoTable
              table={table}
              loading={loading}
              tableHeight="h-[400px]"
              fixedLayout={false}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
