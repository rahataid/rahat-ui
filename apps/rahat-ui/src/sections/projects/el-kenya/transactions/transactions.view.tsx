import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaTransactionsTableColumns } from './use.transactions.table.columns';
import { useKenyaProjectTransactions } from '@rahat-ui/query';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';

export default function TransactionsView() {
  const { id } = useParams() as { id: UUID };
  const {data,error} = useKenyaProjectTransactions();
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

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;

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
      <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
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
              onSearch={() => { }}
            />
          </div>
          <ElkenyaTable table={table} />
        </div>
      </div>
    </>
  );
}
