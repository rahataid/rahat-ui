import { useCambodiaVendorTransactions, usePagination } from '@rahat-ui/query';
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
import CambodiaTable from '../table.component';
import { useTransactionHistoryTableColumns } from './use.transaction.history.table.columns';
import Pagination from 'apps/rahat-ui/src/components/pagination';

type IProps = {
  vendorAddress: string;
};

export default function TransactionHistoryView({ vendorAddress }: IProps) {
  const { id } = useParams() as { id: UUID };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const { data: vendorTransactions, isLoading } = useCambodiaVendorTransactions(
  //   '0x9ffb7323c3f10abfe2e386bdf96de715201c1ab3',
  // );
  const { data: vendorTransactions, isLoading } =
    useCambodiaVendorTransactions(vendorAddress);
  const columns = useTransactionHistoryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: vendorTransactions || [],
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
  return (
    <>
      <div className="rounded border bg-card p-4 mb-0 pb-0">
        <CambodiaTable
          table={table}
          tableHeight="h-[calc(100vh-570px)]"
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
    </>
  );
}
