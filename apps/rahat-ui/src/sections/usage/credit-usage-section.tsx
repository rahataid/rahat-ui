'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
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
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Credit Consumption</h3>
        <UsageFilters
          selectedXref={xref}
          onXrefChange={onXrefChange}
          onDateChange={onDateChange}
          onDateClear={onDateClear}
        />
      </div>

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
    </div>
  );
}
