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

import {
  useGrievanceList,
  usePagination,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
import {
  AddButton,
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { UUID } from 'crypto';
import { useGrievancesTableColumns } from './columns';
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
  const { activeTab, setActiveTab } = useActiveTab('beneficiary');
  const searchParams = useSearchParams();
  const refreshSearch = searchParams.get('tab');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
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
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  return (
    <div className="p-4 rounded-sm border">
      <div className="flex mb-2 gap-2">
        <SearchInput
          className="w-full"
          name="Title"
          onSearch={(e) => handleSearch(e, 'search')}
          value={filters?.search || ''}
        />
        <AddButton
          path={`/projects/aa/${id}/grievances/add`}
          name="Grievance"
          variant="default"
        />
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
