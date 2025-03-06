import React from 'react';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ClientSidePagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'packages/modules';
import { useFundManagementTableColumns } from '../columns/useFMColumns';
import { IFundManagement } from '../types';
import { useGroupsReservedFunds, usePagination } from '@rahat-ui/query';
import { CustomPagination } from 'apps/rahat-ui/src/common';

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
    filters,
  } = usePagination();

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
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
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
        className="w-full"
        name=""
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <DemoTable
        table={table}
        tableHeight={
          groupsFundsData?.response?.data?.length > 0
            ? 'h-[calc(100vh-420px)]'
            : 'h-[calc(100vh-800px)]'
        }
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
