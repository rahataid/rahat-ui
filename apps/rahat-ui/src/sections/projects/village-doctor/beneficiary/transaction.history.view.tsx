'use client';
import {
  useCambodiaBeneficiaryTransactions,
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
import CambodiaTable from '../table.component';
import { useTransactionHistoryTableColumns } from './use.transaction.history.table.columns';

type Props = {
  walletAddress?: string;
};
export default function TransactionHistoryView({ walletAddress }: Props) {
  const { id } = useParams() as { id: UUID };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = useTransactionHistoryTableColumns();

  const { data: beneficiaryTransactions, isLoading } =
    useCambodiaBeneficiaryTransactions(
      walletAddress || '0xaacbee76efd2221bc6c86d60e83ed0b2fb539b47',
    );

  const tableData: any = React.useMemo(() => {
    if (beneficiaryTransactions) return beneficiaryTransactions;
    else return [];
  }, [beneficiaryTransactions]);
  const table = useReactTable({
    manualPagination: true,
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
    getRowId(originalRow) {
      return originalRow.id;
    },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="rounded border bg-card p-4">
      <CambodiaTable
        table={table}
        tableHeight="h-[calc(100vh-500px)]"
        loading={isLoading}
      />
    </div>
  );
}
