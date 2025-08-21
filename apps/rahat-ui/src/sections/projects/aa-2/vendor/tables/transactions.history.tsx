import { useGetTxnRedemptionRequestList, usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { useParams } from 'next/navigation';
import React from 'react';
import { useVendorsTransactionTableColumns } from '../columns/useTransactionColumns';

export default function VendorsTransactionsHistory() {
  const { id, vendorId } = useParams();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const {
    filters,
    setFilters,
    pagination,
    setPagination,
    setNextPage,
    setPerPage,
    setPrevPage,
  } = usePagination();
  const debounceSearch = useDebounce(filters, 500);

  const { data, isLoading } = useGetTxnRedemptionRequestList({
    projectUUID: id,
    uuid: vendorId,
    ...pagination,
    name: debounceSearch.name,
  });

  const columns = useVendorsTransactionTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
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
    <div className=" space-y-1">
      <Heading
        title="Transaction History"
        titleStyle="text-lg"
        description="List of all the transactions made"
      />

      <SearchInput
        className="w-full"
        name="name"
        onSearch={(e) => handleSearch(e, 'name')}
        value={filters?.name || ''}
      />
      <DemoTable
        table={table}
        tableHeight={'h-[calc(400px)]'}
        loading={isLoading}
      />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={
          (data?.response?.meta as any) || {
            total: 0,
            lastPage: 0,
            currentPage: 0,
            perPage: 0,
            prev: null,
            next: null,
          }
        }
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      />
    </div>
  );
}
