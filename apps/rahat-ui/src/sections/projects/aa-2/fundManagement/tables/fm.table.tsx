import React from 'react';
import { useGroupsReservedFunds, usePagination } from '@rahat-ui/query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useSearchParams } from 'next/navigation';
import { useFundManagementTableColumns } from '../columns/useFMColumns';

export default function FundManagementList() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as UUID;

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { data: groupsFundsData, isLoading } = useGroupsReservedFunds(
    projectId,
    {
      ...pagination,
      ...filters,
    },
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useFundManagementTableColumns();
  const table = useReactTable({
    data: groupsFundsData?.response?.data || [],
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div className="">
      <Heading
        title="Fund Management List"
        titleStyle="text-lg"
        description="List of all the funds created"
      />
      <SearchInput
        className="w-full mb-2"
        name="title"
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('title')?.setFilterValue(event.target.value)
        }
      />

      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-420px)]"
        loading={isLoading}
      />
      <CustomPagination
        meta={
          groupsFundsData?.response?.meta || {
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }
        }
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={groupsFundsData?.response?.meta?.lastPage || 0}
      />
    </div>
  );
}
