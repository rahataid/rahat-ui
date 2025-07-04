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

import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import BeneficiaryGroups from './BeneficiaryGroups';
import { useProjectBeneficiaryTableColumns } from './columns';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
function BeneficiaryTable() {
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
  const columns = useProjectBeneficiaryTableColumns();
  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: uuid,
    ...filters,
  });

  const table = useReactTable({
    manualPagination: true,
    data: projectBeneficiaries?.data?.data || [],
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
  React.useEffect(() => {
    if (searchParams.get('tab') === 'beneficiary') {
      setFilters({});
    }
  }, [searchParams]);
  return (
    <div className="p-4 rounded-sm border">
      <div className="flex mb-2 gap-2">
        <SearchInput
          className="w-full"
          name="walletAddress"
          onSearch={(e) => handleSearch(e, 'search')}
          value={filters?.search || ''}
        />
      </div>
      <DemoTable
        table={table}
        loading={projectBeneficiaries.isLoading}
        message="No Beneficiaries Available"
      />

      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={
          (projectBeneficiaries?.data?.response?.meta as any) || {
            total: 0,
            currentPage: 0,
          }
        }
        perPage={pagination?.perPage}
        total={projectBeneficiaries?.data?.response?.meta?.total || 0}
      />
    </div>
  );
}

export default memo(BeneficiaryTable);
