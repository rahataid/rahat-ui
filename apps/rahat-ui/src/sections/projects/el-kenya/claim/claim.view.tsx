'use client';
import {
  dataTagSymbol,
  useListRedemptions,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import useTableColumn from './use.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import SelectComponent from '../select.component';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import FiltersTags from '../../components/filtersTags';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export const redemptionType = [
  {
    key: 'ALL',
    value: 'ALL',
  },
  {
    key: 'REQUESTED',
    value: 'REQUESTED',
  },
  {
    key: 'APPROVED',
    value: 'APPROVED',
  },
];

export default function ClaimView() {
  const router = useRouter();
  const { id, Id } = useParams() as { id: UUID; Id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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

  React.useEffect(() => {
    setFilters('');
  }, []);

  const debouncedFilters = useDebounce(filters, 500);

  const columns = useTableColumn();

  const { data, isSuccess, isFetching } = useListRedemptions(id, {
    page: pagination.page,
    perPage: pagination.perPage,
    ...debouncedFilters,
  });

  const handleRedmpType = React.useCallback(
    (type: string) => {
      resetSelectedListItems();
      if (type === 'ALL') {
        setFilters({ ...filters, status: undefined });
        return;
      }
      setFilters({ ...filters, status: type });
    },
    [filters, setFilters],
  );

  const table = useReactTable({
    manualPagination: true,
    data: data?.redemptions || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.uuid;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-[28px]">Claim</h1>
          <p className="text-muted-foreground text-base">
            Track all the claim reports here
          </p>
        </div>
        <div className="rounded border bg-card p-4 pb-0">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="vendors"
              onSearch={(e) => {
                setFilters({ ...filters, vendor: e.target.value });
              }}
              value={filters?.vendor || ''}
            />
            <SelectComponent
              className="w-1/4"
              onChange={(value) => handleRedmpType(value)}
              name="Status"
              options={['ALL', 'REQUESTED', 'APPROVED']}
              value={filters?.status || ''}
            />
          </div>
          {Object.keys(filters).length != 0 && (
            <FiltersTags
              filters={filters}
              setFilters={setFilters}
              total={data?.redemptions?.length}
            />
          )}
          <ElkenyaTable
            table={table}
            tableHeight={
              Object.keys(filters).length
                ? 'h-[calc(100vh-351px)]'
                : 'h-[calc(100vh-285px)]'
            }
            loading={isFetching}
          />
          <CustomPagination
            meta={data?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={data?.meta?.lastPage || 0}
          />
        </div>
      </div>
    </>
  );
}
