'use client';

import { useDailyMonitoring, usePagination } from '@rahat-ui/query';
import { cn } from '@rahat-ui/shadcn/src';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ClientSidePagination,
  IconLabelBtn,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';

import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import useDailyMonitoringTableColumn from '../useDailyMonitoringTableColumn';
import DailyMonitoringTable from './daily.monitoring.table';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

export default function DailyMonitoringListView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userSearchText, setUserSearchText] = React.useState<string>('');
  const [locationFilterItem, setLocationFilterItem] =
    React.useState<string>('');
  const [dateFilterItem, setDateFilterItem] = React.useState<string>('');
  const [date, setDate] = React.useState<Date | null>(null);
  const { filters, setFilters } = usePagination();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = useDailyMonitoringTableColumn();

  const { data: MonitoringData, isLoading } = useDailyMonitoring(projectId, {
    ...filters,
  });

  const table = useReactTable({
    // manualPagination: true,
    data: MonitoringData?.data?.results ?? [],
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPaginationState,
    state: {
      columnFilters,
      pagination: paginationState,
    },
  });

  return (
    <div className="p-1 pt-0 ">
      <div className="flex gap-2 items-center mb-2">
        <SearchInput
          className="w-full"
          name=" Created By"
          value={
            (table.getColumn('dataEntryBy')?.getFilterValue() as string) ?? ''
          }
          onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('dataEntryBy')?.setFilterValue(event.target.value)
          }
        />
        <SelectComponent
          name="River Basin"
          options={['ALL', 'MAHAKALI', 'KARNALI', 'BHERI']}
          value={
            (table.getColumn('riverBasin')?.getFilterValue() as string) ?? ''
          }
          onChange={(value) =>
            table
              .getColumn('riverBasin')
              ?.setFilterValue(value === 'ALL' ? undefined : value)
          }
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={(val) => {
                if (!val) return;
                setDate(val);
                table.getColumn('createdAt')?.setFilterValue(val);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {date && (
          <Button
            variant="secondary"
            onClick={() => {
              setDate(null);
              table.getColumn('createdAt')?.setFilterValue(undefined);
            }}
          >
            Clear date
          </Button>
        )}
        <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]} hasContent={false}>
          <IconLabelBtn
            handleClick={() =>
              router.push(
                `/projects/aa/${projectId}/data-sources/daily-monitoring/add`,
              )
            }
            name="Add"
            Icon={Plus}
          />
        </RoleAuth>
      </div>
      <div className="border bg-card rounded">
        <DailyMonitoringTable table={table} loading={isLoading} />

        <ClientSidePagination table={table} />
      </div>
    </div>
  );
}
