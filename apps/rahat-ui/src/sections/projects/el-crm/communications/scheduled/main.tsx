'use client';

import * as React from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  AlertTriangle,
  CalendarClock,
  CalendarRange,
  CheckCircle,
  Plus,
  Radio,
  SlidersHorizontal,
  X,
  Zap,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useScheduledTableColumn } from './useMsgTableColumns';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import DemoTable from 'apps/rahat-ui/src/components/table';
import {
  useListElCrmCampaign,
  useListElCrmTemplate,
  useListElCrmTransport,
  usePagination,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { StatCardsSkeleton, TableSkeleton } from '../skeletons';

export default function ScheduledView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { data, meta, isLoading } = useListElCrmCampaign(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    isScheduled: true,
    order: 'desc',
    ...filters,
  });
  const { data: templates } = useListElCrmTemplate(projectUUID, {
    status: 'APPROVED',
  });
  const transport = useListElCrmTransport(projectUUID);

  const messageIds = new Set(data?.map((d: any) => d.message));

  const scheduledTemplates =
    templates?.filter((template: any) => messageIds.has(template.externalId)) ||
    [];

  const hasActiveFilters = Object.values(filters || {}).some(
    (value) => value !== undefined && value !== null && value !== '',
  );

  const activeFilterCount = [
    filters?.message,
    filters?.transportId,
    filters?.status,
    filters?.startDate || filters?.endDate ? 'dateRange' : undefined,
  ].filter(Boolean).length;

  const isFutureScheduled = (item: any) => {
    const scheduledTime = item?.options?.scheduledTimestamp;
    if (!scheduledTime) return false;

    const scheduledDate = new Date(scheduledTime);
    if (Number.isNaN(scheduledDate.getTime())) return false;

    return scheduledDate > new Date();
  };

  const sentCount = (data || []).filter(
    (item: any) => item?.sessionId && !isFutureScheduled(item),
  ).length;

  const pendingSchedulesCount = (data || []).filter((item: any) =>
    isFutureScheduled(item),
  ).length;

  const clearAllFilters = () => {
    setFilters({});
  };

  const columns = useScheduledTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDateChange = (date: Date, type: string) => {
    setFilters((prev) => ({
      ...prev,
      ...(type === 'start' ? { startDate: date } : { endDate: date }),
    }));
  };

  const scheduleStats = [
    {
      title: 'Total',
      value: meta?.total || 0,
      icon: CalendarClock,
      color: 'text-foreground',
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Total number of scheduled items',
    },
    {
      title: 'Already Sent',
      value: meta?.counts?.sent || 0,
      icon: Radio,
      color: 'text-success',
      bgColor: 'bg-success/5',
      iconColor: 'text-success',
      tooltip: 'Messages already sent from schedule',
    },
    {
      title: 'Pending',
      value: meta?.counts?.pending || 0,
      icon: CalendarRange,
      color: 'text-warning',
      bgColor: 'bg-warning/5',
      iconColor: 'text-warning',
      tooltip: 'Messages scheduled for later delivery',
    },
  ];

  const automationStats = [
    {
      title: 'Active Rules',
      value: meta?.automation?.activeRules || 0,
      icon: Zap,
      color: 'text-foreground',
      bgColor: 'bg-blue-500/5',
      iconColor: 'text-blue-500',
      tooltip: 'Number of active automation rules',
    },
    {
      title: 'Auto Sent (24h)',
      value: meta?.automation?.sent24h || 0,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-emerald-500/5',
      iconColor: 'text-emerald-500',
      tooltip: 'Messages sent by automation in last 24 hours',
    },
    {
      title: 'Auto Failed (24h)',
      value: meta?.automation?.failed24h || 0,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/5',
      iconColor: 'text-destructive',
      tooltip: 'Automation messages that failed in last 24 hours',
    },
  ];

  const getNextAutomationRun = () => {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setUTCHours(0, 0, 0, 0);
    if (nextRun <= now) {
      nextRun.setUTCDate(nextRun.getUTCDate() + 1);
    }
    const diffMs = nextRun.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const localTime = nextRun.toLocaleString(undefined, {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
    return { distance: `${hours}h ${minutes}m`, localTime };
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Scheduled Messages
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage scheduled messages
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
                >
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Schedule Message
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Create a new scheduled message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats Sections */}
          {isLoading ? (
            <>
              <StatCardsSkeleton count={3} />
              <StatCardsSkeleton count={3} />
            </>
          ) : (
            <>
              <StatSection
                heading="Schedule"
                description="Status of one-off scheduled messages."
                stats={scheduleStats}
              />
              <StatSection
                heading="Automation"
                description="Event-driven campaigns triggered by rules."
                stats={automationStats}
              />
            </>
          )}

          {/* Automation Info Bar */}
          {(meta?.automation?.activeRules ?? 0) > 0 && (() => {
            const nextRun = getNextAutomationRun();
            return (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Next automation run in{' '}
                    <span className="font-medium text-foreground">
                      {nextRun.distance}
                    </span>{' '}
                    <span className="text-xs">
                      ({nextRun.localTime} · runs daily at midnight UTC)
                    </span>
                  </span>
                </div>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose?tab=automatic`}
                >
                  <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs">
                    <Zap className="h-3.5 w-3.5" />
                    View Automation
                  </Button>
                </Link>
              </div>
            );
          })()}

          {/* Scheduled Table Card */}
          <Card className="flex flex-col">
            {/* Filter Bar */}
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
                {/* Template Filter */}
                <div className="space-y-1.5 flex-1">
                  <Label className="text-xs text-muted-foreground">
                    Template
                  </Label>
                  <Select
                    value={filters?.message || 'all'}
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        message: value === 'all' ? undefined : value,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="All Templates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      {scheduledTemplates.map((template: any) => (
                        <SelectItem
                          key={template.externalId}
                          value={template.externalId}
                        >
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel Filter */}
                <div className="space-y-1.5 min-w-[180px]">
                  <Label className="text-xs text-muted-foreground">
                    Channel
                  </Label>
                  <Select
                    value={filters?.transportId || 'all'}
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        transportId: value === 'all' ? undefined : value,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-[160px] h-9 text-sm">
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      {transport?.data?.map((channel: any) => (
                        <SelectItem key={channel.cuid} value={channel.cuid}>
                          {channel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5 min-w-[180px]">
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <Select
                    value={filters?.status || 'all'}
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        status: value === 'all' ? undefined : value,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-[150px] h-9 text-sm">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
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

              {/* Active Filter Tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Showing {data?.length || 0} scheduled message
                    {(data?.length || 0) === 1 ? '' : 's'} for:
                  </span>
                  {filters?.message && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Template: {scheduledTemplates.find((t: any) => t.externalId === filters.message)?.name || filters.message}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, message: undefined }))
                        }
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters?.transportId && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Channel: {transport?.data?.find((c: any) => c.cuid === filters.transportId)?.name || filters.transportId}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, transportId: undefined }))
                        }
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {filters?.status && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Status: {filters.status}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, status: undefined }))
                        }
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(filters?.startDate || filters?.endDate) && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Date: {filters.startDate ? new Date(filters.startDate).toLocaleDateString() : '...'} – {filters.endDate ? new Date(filters.endDate).toLocaleDateString() : '...'}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            startDate: undefined,
                            endDate: undefined,
                          }))
                        }
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Table */}
            <CardContent className="p-0">
              {isLoading ? (
                <TableSkeleton rows={8} />
              ) : data.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <CalendarClock className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    No scheduled messages found
                  </h3>
                  <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">
                    {hasActiveFilters
                      ? 'No messages match your filters. Clear filters or adjust your date range to see more results.'
                      : 'Schedule your first message to start planning outreach campaigns.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearAllFilters}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Reset Filters
                      </Button>
                    )}
                    <Link
                      href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
                    >
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule Message
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <DemoTable
                    table={table}
                    tableHeight="h-[calc(100vh-515px)]"
                  />
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
    </TooltipProvider>
  );
}

type StatCardDef = {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  iconColor: string;
  tooltip: string;
};

function StatSection({
  heading,
  description,
  stats,
}: {
  heading: string;
  description?: string;
  stats: StatCardDef[];
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {heading}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground leading-none">
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold tracking-tight ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="max-w-[220px]">{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
