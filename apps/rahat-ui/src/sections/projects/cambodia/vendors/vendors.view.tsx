import { useCambodiaVendorsList, usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
// import { useCambodiaChwTableColumns } from './use.chw.table.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import CambodiaTable from '../table.component';
import { useCambodiaVendorsTableColumns } from './use.vendors.table.columns';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };
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
    setPagination,
    resetSelectedListItems,
  } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);
  const { data: vendors, isLoading } = useCambodiaVendorsList({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
  });

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };
  const columns = useCambodiaVendorsTableColumns();
  const table = useReactTable({
    manualPagination: true,

    data: vendors?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
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
          <h1 className="font-semibold text-2xl">Vision Centers</h1>
          <p className="text-muted-foreground text-base">
            Track all the vision center reports here.
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="name"
              className="w-full"
              value={table.getColumn('name')?.getFilterValue() as string}
              onSearch={(event) => handleFilterChange(event)}
            />
          </div>
          <CambodiaTable table={table} tableHeight="h-[calc(100vh-294px)]" />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(vendors?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={vendors?.response?.meta?.total || 0}
      />
    </>
  );
}
