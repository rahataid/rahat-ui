import { useAAVendorsList, usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import React from 'react';
import { useProjectVendorTableColumns } from '../table.columns';
import { UUID } from 'crypto';
import { useSearchParams } from 'next/navigation';

export const VendorList = ({ id }: { id: UUID }) => {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const searchParams = useSearchParams();
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

  React.useEffect(() => {
    if (searchParams.get('tab') === 'vendorList') {
      setFilters({});
    }
  }, [searchParams]);
  return (
    <div className="rounded border bg-card p-4">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full"
          name="name"
          onSearch={(e) => handleSearch(e, 'search')}
          value={filters?.search || ''}
        />
      </div>
      <DemoTable table={table} tableHeight="h-[500px]" loading={isLoading} />
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
  );
};
