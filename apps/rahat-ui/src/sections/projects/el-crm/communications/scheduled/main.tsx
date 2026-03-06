'use client';

import { useState } from 'react';
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
import { Plus, Clock, X } from 'lucide-react';
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
  const { data: templates } = useListElCrmTemplate(projectUUID);
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
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No scheduled messages
            </h3>
            <p className="text-muted-foreground mb-6">
              Schedule your first message to get started
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Message
              </Button>
            </Link>
          </div>
        ) : (
          <Card>
            {Object.keys(filters).length != 0 && (
              <FiltersTags
                filters={filters}
                setFilters={setFilters}
                total={data?.length}
              />
            )}
            <CardContent className={`space-y-4 ${true ? 'mt-6' : ''}`}>
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-3 bg-muted/50 p-4 rounded-lg">
                {/* Template Filter */}
                <div className="space-y-2">
                  <Label htmlFor="template-filter" className="text-sm">
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
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="channel-filter" className="text-sm">
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
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="date-filter" className="text-sm">
                    Date
                  </Label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      {/* {uniqueDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {format(new Date(date), 'MMM dd, yyyy')}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              {/* <div className="text-sm text-muted-foreground">
                Showing {filteredMessages.length} of {scheduledMessages.length}{' '}
                messages
              </div> */}

              {/* Table */}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
