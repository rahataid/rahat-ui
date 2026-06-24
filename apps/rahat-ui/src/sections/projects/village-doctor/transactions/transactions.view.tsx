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
import { VillageDoctorPageShell } from '../page-shell';

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
    <VillageDoctorPageShell
      title="Transactions"
      subtitle="Blockchain-documented disbursements and program events for this project."
      contentClassName="space-y-6"
    >
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
    </VillageDoctorPageShell>
  );
}
