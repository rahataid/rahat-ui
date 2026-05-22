'use client';
import { useCambodiaProjectTransactions } from '@rahat-ui/query';
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
import SearchInput from '../../components/search.input';
import CambodiaTable from '../table.component';
import { useTableColumns } from './use.table.columns';
import ViewColumns from '../../components/view.columns';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { SlidersHorizontal } from 'lucide-react';

export default function TransactionsView() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading } = useCambodiaProjectTransactions();
  const tableData: any = React.useMemo(() => {
    if (data) return data;
    else return [];
  }, [data]);

  const columns = useTableColumns();
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
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="border-b border-border/80 bg-card/95 px-6 py-5 shadow-sm shadow-black/[0.03] backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Transactions
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Blockchain-documented disbursements and program events for this
            project.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-6">
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border px-5 py-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              Filters
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchInput
                className="w-full sm:flex-1"
                name="topic"
                value={
                  (table.getColumn('topic')?.getFilterValue() as string) ?? ''
                }
                onSearch={(event) =>
                  table.getColumn('topic')?.setFilterValue(event.target.value)
                }
              />
              <ViewColumns table={table} />
            </div>
          </CardHeader>
          <CardContent className="space-y-0 p-0">
            <CambodiaTable
              table={table}
              tableHeight="h-[calc(100vh-420px)]"
              loading={isLoading}
              emptyMessage="No transactions found."
            />
            <div className="border-t border-border/70 bg-muted/15 px-3 py-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
