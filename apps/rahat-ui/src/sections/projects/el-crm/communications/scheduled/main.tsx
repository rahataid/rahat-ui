'use client';

import { useState } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Plus, Clock, SlidersHorizontal } from 'lucide-react';
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

  const [filterDate, setFilterDate] = useState('all');

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
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

  const activeFilterCount = Object.keys(filters).length;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Scheduled Messages
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                View and manage scheduled messages
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
                >
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Message
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Create a new scheduled message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-6">
          {data.length === 0 && activeFilterCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No scheduled messages
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Schedule your first message to get started
              </p>
              <Link
                href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
              >
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Message
                </Button>
              </Link>
            </div>
          ) : (
            <Card>
              {activeFilterCount > 0 && (
                <FiltersTags
                  filters={filters}
                  setFilters={setFilters}
                  total={data?.length}
                />
              )}
              <CardContent className="space-y-4 pt-6">
                {/* Filters */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Filters
                    </span>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="tabular-nums text-xs">
                        {activeFilterCount} active
                      </Badge>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Template Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="template-filter" className="text-xs font-medium text-muted-foreground">
                        Template
                      </Label>
                      <Select
                        value={filters?.message || ''}
                        onValueChange={(value) => {
                          setFilters((prev) => ({
                            ...prev,
                            message: value === 'all' ? undefined : value,
                          }));
                        }}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="All Templates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Templates</SelectItem>
                          {scheduledTemplates.map((template) => (
                            <SelectItem key={template} value={template.externalId}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Channel Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="channel-filter" className="text-xs font-medium text-muted-foreground">
                        Channel
                      </Label>
                      <Select
                        value={filters?.transportId || ''}
                        onValueChange={(value) => {
                          setFilters((prev) => ({
                            ...prev,
                            transportId: value === 'all' ? undefined : value,
                          }));
                        }}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="All Channels" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Channels</SelectItem>
                          {transport?.data?.map((channel) => (
                            <SelectItem key={channel} value={channel.cuid}>
                              {channel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-1.5">
                      <Label htmlFor="date-filter" className="text-xs font-medium text-muted-foreground">
                        Date
                      </Label>
                      <div className="flex gap-2">
                        <DatePicker
                          placeholder="Pick Start Date"
                          handleDateChange={handleDateChange}
                          type="start"
                          value={
                            filters?.startDate
                              ? new Date(filters.startDate)
                              : undefined
                          }
                        />
                        <DatePicker
                          placeholder="Pick End Date"
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

                {/* Table */}
                <div className="-mx-6">
                  <DemoTable table={table} />
                </div>
                <CustomPagination
                  meta={meta || { total: 0, currentPage: 0 }}
                  handleNextPage={setNextPage}
                  handlePrevPage={setPrevPage}
                  handlePageSizeChange={setPerPage}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={meta?.total}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
