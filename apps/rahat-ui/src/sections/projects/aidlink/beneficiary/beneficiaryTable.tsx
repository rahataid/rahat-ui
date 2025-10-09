'use client';

import * as React from 'react';
import { memo } from 'react';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useParams } from 'next/navigation';

import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';

import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useProjectBeneficiaryTableColumns } from './columns';

function BeneficiaryTable() {
  const { id } = useParams();
  const uuid = id as UUID;

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();
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
  });

  const table = useReactTable({
    manualPagination: true,
    data: projectBeneficiaries?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div className="p-4 rounded-sm border">
      <div className="flex mb-2 gap-2">
        <SearchInput
          className="w-full"
          name="name"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
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
