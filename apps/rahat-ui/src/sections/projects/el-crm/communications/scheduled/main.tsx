'use client';

import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  CalendarClock,
  CalendarRange,
  Filter,
  Plus,
  Radio,
  Users,
  X,
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
import FiltersTags from '../../../components/filtersTags';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';

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
  const { data, meta } = useListElCrmCampaign(projectUUID, {
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

  const activeFilterCount = Object.values(filters || {}).filter(
    (value) => value !== undefined && value !== null && value !== '',
  ).length;

  const totalRecipients = (data || []).reduce(
    (sum: number, item: any) => sum + Number(item?.recipientCount || 0),
    0,
  );

  const sentCount = (data || []).filter((item: any) => item?.sessionId).length;

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

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Scheduled Messages
            </h1>
            <p className="text-muted-foreground">
              View and manage scheduled messages
            </p>
          </div>
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

      <div className="flex-1 p-6">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    This Page
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {data?.length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled items
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600">
                  <Radio className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Already Sent
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {sentCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sent from schedule
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 sm:col-span-2 lg:col-span-1">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-md bg-blue-500/10 p-2 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Reach
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {totalRecipients.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recipients on this page
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/80">
            {hasActiveFilters && (
              <FiltersTags
                filters={filters}
                setFilters={setFilters}
                total={data?.length}
              />
            )}

            <CardContent className="space-y-4 pt-6">
              <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    Filters
                    {hasActiveFilters && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {activeFilterCount} active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={clearAllFilters}
                      disabled={!hasActiveFilters}
                    >
                      <X className="mr-2 h-3.5 w-3.5" />
                      Clear Filters
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="template-filter" className="text-sm">
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
                      <SelectTrigger id="template-filter">
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

                  <div className="space-y-2">
                    <Label htmlFor="channel-filter" className="text-sm">
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
                      <SelectTrigger id="channel-filter">
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

                  <div className="space-y-2">
                    <Label htmlFor="date-filter" className="text-sm">
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
                          filters?.endDate ? new Date(filters.endDate) : undefined
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing <span className="font-medium text-foreground">{data?.length || 0}</span> scheduled messages
                </p>
                <p className="flex items-center gap-1">
                  <CalendarRange className="h-4 w-4" />
                  Total available: <span className="font-medium text-foreground">{meta?.total || 0}</span>
                </p>
              </div>

              {data.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-background px-6 py-12 text-center">
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
                  <DemoTable table={table} />
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
    </div>
  );
}
