import { useCambodiaVendorsList, usePagination } from '@rahat-ui/query';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import SearchInput from '../../components/search.input';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import CambodiaTable from '../table.component';
import { useCambodiaVendorsTableColumns } from './use.vendors.table.columns';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { filters, setFilters } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);
  const { data: vendors, isLoading } = useCambodiaVendorsList({
    projectUUID: id,
    ...(debouncedSearch as any),
  });

  const tableData: any = React.useMemo(() => {
    if (vendors?.data)
      return vendors?.data.map((vendor) => ({
        ...vendor,
        name: vendor.User?.name,
        phone: vendor.User?.phone,
        wallet: vendor.User?.wallet,
      }));
    else return [];
  }, [vendors?.data]);
  const columns = useCambodiaVendorsTableColumns();
  const table = useReactTable({
    data: tableData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
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
          <CambodiaTable
            table={table}
            tableHeight="h-[calc(100vh-340px)]"
            loading={isLoading}
          />
        </div>

        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          setPageSize={table.setPageSize}
          canPreviousPage={table.getCanPreviousPage()}
          previousPage={table.previousPage}
          canNextPage={table.getCanNextPage()}
          nextPage={table.nextPage}
        />
      </div>
    </>
  );
}
