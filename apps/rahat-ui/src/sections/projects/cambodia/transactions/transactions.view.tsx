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
  Alert,
  AlertDescription,
  AlertTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function TransactionsView() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading, isError, error, refetch } =
    useCambodiaProjectTransactions();
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
    <>
      <div className="p-4">
        <div className="mb-2">
          <h1 className="font-semibold text-2xl mb-">Transactions</h1>
          <p className="text-muted-foreground">
            These transactions are documented on the blockchain.
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          {isError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Could not load subgraph transactions</AlertTitle>
              <AlertDescription className="mt-2 space-y-2 text-left">
                <p>
                  The UI calls your project&apos;s{' '}
                  <strong>SUBGRAPH_URL</strong> (GraphQL). This request failed:
                  {' '}
                  {error instanceof Error ? error.message : String(error)}
                </p>
                <p className="text-muted-foreground">
                  Fix: run Graph Node / deploy the Cambodia subgraph, set the
                  correct URL in project settings, or override locally with{' '}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    NEXT_PUBLIC_CAMBODIA_SUBGRAPH_URL
                  </code>{' '}
                  (for example{' '}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    http://localhost:8000/subgraphs/name/rahat/cambodia/
                  </code>
                  ). Stale{' '}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    localhost:5001
                  </code>{' '}
                  URLs from settings are ignored in the app and fall back to
                  that default when no env override is set.
                </p>
                <button
                  type="button"
                  className="text-sm font-medium underline underline-offset-2"
                  onClick={() => void refetch()}
                >
                  Try again
                </button>
              </AlertDescription>
            </Alert>
          ) : null}
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
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
          <CambodiaTable
            table={table}
            tableHeight="h-[calc(100vh-300px)]"
            loading={isLoading && !isError}
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
