'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  useReactTable,
  getCoreRowModel,
} from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import ChartLine from '@rahat-ui/shadcn/src/components/charts/chart-components/chart-line';
import { DemoTable } from '../../common/table';
import { creditColumns, CreditRow } from './useCreditColumns';
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
  defaultFrom?: Date;
  defaultTo?: Date;
};

function transformCreditsForChart(credits: CreditData[]) {
  const dateMap = new Map<string, Map<string, number>>();
  const transportNames = new Set<string>();

  credits.forEach((item) => {
    const dateKey = format(new Date(item.date), 'MMM dd');
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

  const sortedDates = Array.from(dateMap.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
  const transports = Array.from(transportNames);

  const series = transports.map((name) => ({
    name,
    data: sortedDates.map((date) => dateMap.get(date)?.get(name) ?? 0),
  }));

  return { categories: sortedDates, series };
}

export default function CreditUsageSection({
  credits,
  loading,
  xref,
  onXrefChange,
  onDateChange,
  onDateClear,
  defaultFrom,
  defaultTo,
}: CreditUsageSectionProps) {
  const chartData = useMemo(
    () => transformCreditsForChart(credits ?? []),
    [credits],
  );

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
          Credit Consumption
        </CardTitle>
        <UsageFilters
          selectedXref={xref}
          onXrefChange={onXrefChange}
          onDateChange={onDateChange}
          onDateClear={onDateClear}
          defaultFrom={defaultFrom}
          defaultTo={defaultTo}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {chartData.series.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Credits Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ChartLine
                series={chartData.series}
                categories={chartData.categories}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Credit Breakdown
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
