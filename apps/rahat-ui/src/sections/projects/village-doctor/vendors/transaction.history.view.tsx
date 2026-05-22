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
import React from 'react';
import CambodiaTable from '../table.component';
import { useTransactionHistoryTableColumns } from './use.transaction.history.table.columns';
import Pagination from 'apps/rahat-ui/src/components/pagination';

type IProps = {
  vendorTransactions: Record<string, unknown>[] | undefined;
  isLoading: boolean;
};

export default function TransactionHistoryView({
  vendorTransactions,
  isLoading,
}: IProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});
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
          tableHeight="h-[calc(300px)]"
          loading={isLoading}
          emptyMessage="No transactions found."
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
