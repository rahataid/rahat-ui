'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Link from 'next/link';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  ArrowLeft,
  Download,
  History,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  useListElCrmAutomationLogs,
  useListElCrmAutomation,
  usePagination,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';

const STATUS_OPTIONS = ['SENT', 'FAILED', 'PENDING', 'SKIPPED'];

function getStatusVariant(status: string) {
  switch (status?.toUpperCase()) {
    case 'SENT':
      return 'success';
    case 'FAILED':
      return 'destructive';
    case 'PENDING':
      return 'warning';
    case 'SKIPPED':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function AutomationHistoryView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data, meta } = useListElCrmAutomationLogs(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    ...filters,
  });

  const { data: automationRules } = useListElCrmAutomation(projectUUID);

  const activeFilterCount = [
    filters?.ruleId,
    filters?.status,
    filters?.startDate || filters?.endDate ? 'dateRange' : undefined,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilters({});
  };

  const handleDateChange = (date: Date, type: string) => {
    setFilters((prev: any) => ({
      ...prev,
      ...(type === 'start' ? { startDate: date } : { endDate: date }),
    }));
  };

  const exportCSV = useCallback(() => {
    if (!data?.length) return;

    const headers = [
      'Rule Name',
      'Campaign',
      'Target',
      'Status',
      'Sent At',
      'Reason',
    ];
    const rows = data.map((log: any) => [
      log.ruleName || log.rule?.name || '—',
      log.campaignName || log.campaign?.name || '—',
      log.targetType || '—',
      log.status || '—',
      log.createdAt ? new Date(log.createdAt).toLocaleString() : '—',
      log.reason || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `automation-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Automation History
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                View automation execution logs and delivery history
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            disabled={!data?.length}
            onClick={exportCSV}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <Card className="flex flex-col">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5 min-w-[200px]">
                <Label className="text-xs text-muted-foreground">
                  Automation Rule
                </Label>
                <Select
                  value={filters?.ruleId || 'all'}
                  onValueChange={(value) => {
                    setFilters((prev: any) => ({
                      ...prev,
                      ruleId: value === 'all' ? undefined : value,
                    }));
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="All Rules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rules</SelectItem>
                    {(automationRules || []).map((rule: any) => (
                      <SelectItem key={rule.uuid} value={rule.uuid}>
                        {rule.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 min-w-[150px]">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={filters?.status || 'all'}
                  onValueChange={(value) => {
                    setFilters((prev: any) => ({
                      ...prev,
                      status: value === 'all' ? undefined : value,
                    }));
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Date Range
                </Label>
                <div className="flex items-center gap-2">
                  <DatePicker
                    placeholder="Start Date"
                    handleDateChange={handleDateChange}
                    type="start"
                    value={
                      filters?.startDate
                        ? new Date(filters.startDate)
                        : undefined
                    }
                  />
                  <DatePicker
                    placeholder="End Date"
                    handleDateChange={handleDateChange}
                    type="end"
                    value={
                      filters?.endDate
                        ? new Date(filters.endDate)
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            {(!data || data.length === 0) ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <History className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  No automation logs found
                </h3>
                <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                  {activeFilterCount > 0
                    ? 'No logs match your filters. Clear filters or adjust your date range to see more results.'
                    : 'Automation execution logs will appear here once automation rules have been triggered.'}
                </p>
                {activeFilterCount > 0 && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <ScrollArea className="h-[calc(100vh-460px)]">
                  <TableComponent>
                    <TableHeader className="sticky top-0 z-10 bg-background">
                      <TableRow>
                        <TableHead>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Rule Name
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Campaign
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Target
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Status
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Sent At
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Reason
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((log: any, idx: number) => (
                        <TableRow key={log.uuid || idx}>
                          <TableCell className="font-medium">
                            {log.ruleName || log.rule?.name || '—'}
                          </TableCell>
                          <TableCell>
                            {log.campaignName || log.campaign?.name || '—'}
                          </TableCell>
                          <TableCell>{log.targetType || '—'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(log.status)}>
                              {log.status || '—'}
                            </Badge>
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : '—'}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {log.reason || '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableComponent>
                </ScrollArea>
                <CustomPagination
                  meta={meta || { total: 0, currentPage: 0 }}
                  handleNextPage={setNextPage}
                  handlePrevPage={setPrevPage}
                  handlePageSizeChange={setPerPage}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={meta?.total}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
