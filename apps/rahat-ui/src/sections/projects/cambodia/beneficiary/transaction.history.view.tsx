'use client';
import { usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import CambodiaTable from '../table.component';
import { useTransactionHistoryTableColumns } from './use.transaction.history.table.columns';

export default function TransactionHistoryView() {
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
    setPagination,
    resetSelectedListItems,
  } = usePagination();

  const columns = useTransactionHistoryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [
      {
        id: 'a12f4a5d-4f36-4c73-8f9e-19b82a8b5403',
        name: 'Vision Center',
        phone: '9857023857',
        wallet: '0014xx...7555525',
        isVerified: 'Approved',
      },
      {
        id: 'b74c9f8e-2e5a-4b5f-9949-7042e8b3b089',
        name: 'Optical Hub',
        phone: '9123456789',
        wallet: '0012yy...7589634',
        isVerified: 'Not Approved',
      },
      {
        id: 'c85dfe64-995b-4c39-858b-d1e80db3e372',
        name: 'Eye Care Plus',
        phone: '9876543210',
        wallet: '0023zz...2345874',
        isVerified: 'Approved',
      },
      {
        id: 'd9f875bc-488b-4f67-8b8d-75a4d2f88d5d',
        name: 'Clear Vision Clinic',
        phone: '9234567890',
        wallet: '0056bb...9823415',
        isVerified: 'Not Approved',
      },
      {
        id: 'e73c3cb4-917a-4ef1-9dd4-930f2c5f8941',
        name: 'LensPro Center',
        phone: '9988776655',
        wallet: '0044cc...1234567',
        isVerified: 'Approved',
      },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <div className="rounded border bg-card p-4">
      <CambodiaTable table={table} tableHeight="h-[calc(100vh-500px)]" />
    </div>
  );
}
