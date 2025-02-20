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
import { useKenyaProjectTransactions } from '@rahat-ui/query';
import React from 'react';
import ElkenyaTable from '../table.component';
import { ClientSidePagination } from '../clientSidePagination';

export default function TransactionsView() {
  const { id } = useParams() as { id: UUID };
  const { data, error, isLoading } = useKenyaProjectTransactions();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useElkenyaTransactionsTableColumns();
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
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
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-251px)]"
            loading={isLoading}
          />
        </div>
      </div>
      <ClientSidePagination table={table} />
    </>
  );
}
