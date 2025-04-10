import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaTransactionsTableColumns } from './use.transactions.table.columns';
import { useSmsVoucherProjectTransactions } from '@rahat-ui/query';
import React, { useState } from 'react';
import ElkenyaTable from '../table.component';
import { TransactionPagination } from '../transactionPagination';

export default function TransactionsView() {
  const { id } = useParams() as { id: UUID };

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);
  const first = pageSize;
  const skip = page * first;

  const { data, isLoading } = useSmsVoucherProjectTransactions(first, skip);

  // Check if there is more data
  const hasNextPage = data && data.length === pageSize;

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = useState([{ id: 'timeStamp', desc: true }]);

  const columns = useElkenyaTransactionsTableColumns({
    setSorting: setSorting,
  });
  const table = useReactTable({
    data: data || [],
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      sorting,
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
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-251px)]"
            loading={isLoading}
          />
        </div>
      </div>
      <TransactionPagination
        hasNextPage={hasNextPage || false}
        pageSize={pageSize}
        page={page}
        setPageSize={setPageSize}
        setPage={setPage}
      />
    </>
  );
}
