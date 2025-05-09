import React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { projectVendors } from './static';
import { useProjectVendorTableColumns } from './columns/useVendorColumns';
import {
  ClientSidePagination,
  CustomPagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useAAVendorsList, usePagination } from '@rahat-ui/query';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const {
    filters,
    setFilters,
    pagination,
    setPerPage,
    setNextPage,
    setPrevPage,
    setPagination,
  } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);
  const columns = useProjectVendorTableColumns();
  const { data: vendors, isLoading } = useAAVendorsList({
    projectUUID: id,
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    ...(debouncedSearch as any),
  });
  console.log('vendors', vendors);

  const table = useReactTable({
    manualPagination: true,
    data: vendors?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
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
    <>
      <div className="p-4">
        <Heading
          title="Vendors"
          description="Track all the vendor reports here"
        />
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="name"
              onSearch={(e) => handleSearch(e, 'search')}
              value={filters?.search || ''}
            />
          </div>
          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-310px)]"
            loading={isLoading}
          />
          {/* <ClientSidePagination table={table} /> */}
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            setPagination={setPagination}
            meta={
              (vendors?.response?.meta as any) || {
                total: 0,
                currentPage: 0,
              }
            }
            perPage={pagination?.perPage}
            total={vendors?.response?.meta?.total || 0}
          />
        </div>
      </div>
    </>
  );
}
