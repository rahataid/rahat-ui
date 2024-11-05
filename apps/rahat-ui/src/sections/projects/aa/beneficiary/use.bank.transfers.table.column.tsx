'use client';

import { ColumnDef } from '@tanstack/react-table';

export const useBankTransfersTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'accountName',
      header: 'Account Name',
      cell: ({ row }) => (
        <div className="">{row.getValue('accountName') || 'N/A'}</div>
      ),
    },
    {
      accessorKey: 'accountNumber',
      header: 'Account Number',
      cell: ({ row }) => <div> {row.getValue('accountNumber') || 'N/A'}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div> {row.getValue('amount')}</div>,
    },
    {
      accessorKey: 'currency',
      header: 'Currency',
      cell: ({ row }) => <div> {row.getValue('currency')}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div> {row.getValue('date')}</div>,
    },
    {
      accessorKey: 'txId',
      header: 'TxId',
      cell: ({ row }) => <div> {row.getValue('txId')}</div>,
    },
  ];

  return columns;
};
