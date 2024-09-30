import { usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaTransactionsTableColumns } from './use.transactions.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import ViewColumns from '../../components/view.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function TransactionsView() {
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
    resetSelectedListItems,
  } = usePagination();

  const columns = useElkenyaTransactionsTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [
      { walletAddress: '123', topic: 'A1' },
      { walletAddress: '456', topic: 'B1' },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Transactions</h1>
          <p className="text-muted-foreground">
            These transactions are documented on the blockchain.
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="transaction"
              onSearch={() => {}}
            />
            <ViewColumns table={table} />
          </div>
          <ElkenyaTable table={table} tableHeight="h-[calc(100vh-294px)]" />
        </div>
      </div>
      <CustomPagination
        meta={{ total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
}
