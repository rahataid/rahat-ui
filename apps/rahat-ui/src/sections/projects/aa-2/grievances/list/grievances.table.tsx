'use client';

import * as React from 'react';
import { memo, useState } from 'react';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useParams, useSearchParams } from 'next/navigation';

import { useGrievanceList, usePagination } from '@rahat-ui/query';
import {
  AddButton,
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { UUID } from 'crypto';
import { useGrievancesTableColumns } from './columns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  grievancePriority,
  grievanceStatus,
} from 'apps/rahat-ui/src/constants/aa.grievances.constants';
function GrievancesTable() {
  const { id } = useParams();
  const uuid = id as UUID;

  const {
    pagination,
    filters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    setFilters,
    setPagination,
  } = usePagination();
  // Remove unused variables
  useActiveTab('beneficiary');
  const searchParams = useSearchParams();
  searchParams.get('tab'); // Keep for potential side effects
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // We're not using columnFilters directly since we're handling filters manually
  const [, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const columns = useGrievancesTableColumns();

  const projectGrievances = useGrievanceList({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: uuid,
    ...filters,
  });

  const table = useReactTable({
    manualPagination: true,
    data: projectGrievances?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    onSortingChange: setSorting,
    getRowId: (row) => row.uuid,
    state: {
      sorting,
      columnFilters: [], // Using empty array since we're handling filters manually
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters],
  );

  const handleFilterChange = React.useCallback(
    (key: string, value: string) => {
      if (value === 'all') {
        const { [key]: _, ...rest } = filters;
        setFilters(rest);
      } else {
        setFilters({ ...filters, [key]: value });
      }
    },
    [filters, setFilters],
  );

  console.log('filters', filters);

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters, setPagination]);

  return (
    <div className="p-4 rounded-sm border">
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex gap-2">
          <SearchInput
            className="w-full"
            name="Title"
            onSearch={(e) => handleSearch(e, 'title')}
            value={filters?.title || ''}
          />
          <Select
            value={filters?.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {grievanceStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters?.priority || 'all'}
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {grievancePriority.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AddButton
            path={`/projects/aa/${id}/grievances/add`}
            name="Grievance"
            variant="default"
          />
        </div>
      </div>
      <DemoTable table={table} loading={projectGrievances.isLoading} />

      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={
          (projectGrievances?.data?.response?.meta as any) || {
            total: 0,
            currentPage: 0,
          }
        }
        perPage={pagination?.perPage}
        total={projectGrievances?.data?.response?.meta?.total || 0}
      />
    </div>
  );
}

export default memo(GrievancesTable);
