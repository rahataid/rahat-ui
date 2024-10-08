import {
  useCambodiaProjectSubgraphStore,
  useCambodiaProjectTransactions,
  usePagination,
} from '@rahat-ui/query';
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
import CambodiaTable from '../table.component';
import { useTableColumns } from './use.table.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import ViewColumns from '../../components/view.columns';
import Pagination from 'apps/rahat-ui/src/components/pagination';

export default function TransactionsView() {
  const { id } = useParams() as { id: UUID };
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { projectTransactions } = useCambodiaProjectSubgraphStore();
  const tableData: any = React.useMemo(() => {
    if (projectTransactions) return projectTransactions;
    else return [];
  }, [projectTransactions]);
  console.log(tableData);
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
          <CambodiaTable table={table} tableHeight="h-[calc(100vh-300px)]" />
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
