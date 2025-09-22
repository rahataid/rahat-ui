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
import { X } from 'lucide-react';

import { useGrievanceList, usePagination } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
  grievanceType,
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
      if (value === '') {
        const { [key]: _, ...rest } = filters;
        setFilters(rest);
      } else {
        setFilters({ ...filters, [key]: value });
      }
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

  const clearFilters = () => {
    setFilters({});
  };

  const clearFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Get display name for filter values
  const getFilterDisplayName = (key: string, value: string) => {
    if (key === 'status') {
      return grievanceStatus.find((s) => s.value === value)?.label || value;
    }
    if (key === 'priority') {
      return grievancePriority.find((p) => p.value === value)?.label || value;
    }
    return value;
  };

  // Define filter display order
  const filterOrder = ['title', 'status', 'priority'];

  // Sort filters according to the defined order
  const getOrderedFilters = () => {
    return Object.entries(filters).sort(([a], [b]) => {
      const indexA = filterOrder.indexOf(a);
      const indexB = filterOrder.indexOf(b);
      return indexA - indexB;
    });
  };

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters, setPagination]);

  return (
    <div className="p-4 rounded-sm border">
      <div className="flex flex-col space-y-2 mb-4">
        {/* Active filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {getOrderedFilters().map(([key, value]) => (
              <div
                key={key}
                className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-accent/80 hover:bg-accent text-accent-foreground transition-colors"
              >
                <span className="font-medium capitalize">{key}:</span>
                <span className="ml-1">{getFilterDisplayName(key, value)}</span>
                <button
                  onClick={() => clearFilter(key)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <SearchInput
            className="flex-1"
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
              <SelectItem value="all">All Status</SelectItem>
              {grievanceStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters?.type || 'all'}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Grievance Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grievance Type</SelectItem>
              {grievanceType.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
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
              <SelectItem value="all">All Priority</SelectItem>
              {grievancePriority.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <AddButton
              path={`/projects/aa/${id}/grievances/add`}
              name="Grievance"
              variant="default"
            />
          </div>
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
