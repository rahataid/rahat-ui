import {
  useGetVendorTokenRedemptionList,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { UUID } from 'crypto';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useProjectVendorRedemptionTableColumns } from '../table.columns';

export const VendorRedemptionList = ({ id }: { id: UUID }) => {
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

  const debounceSearch = useDebounce(filters, 500);

  const searchParams = useSearchParams();
  const columns = useProjectVendorRedemptionTableColumns(id);

  const { data, isLoading } = useGetVendorTokenRedemptionList({
    projectUUID: id,
    ...pagination,
    name: debounceSearch.name,
  });

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

  React.useEffect(() => {
    if (searchParams.get('tab') === 'vendorRedemptionList') {
      setFilters({});
    }
  }, [searchParams]);

  return (
    <div className="rounded border bg-card p-4">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full"
          name="name"
          onSearch={(e) => handleSearch(e, 'name')}
          value={filters?.name || ''}
        />
      </div>
      <DemoTable
        table={table}
        tableHeight="h-[500px]"
        message="No Vendor Redemption Requests"
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
};
