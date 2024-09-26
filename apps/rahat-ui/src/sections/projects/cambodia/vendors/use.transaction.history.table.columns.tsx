import { ColumnDef } from '@tanstack/react-table';

export const useTransactionHistoryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'referredBy',
      header: 'Referred By',
      cell: ({ row }) => <div>{row.getValue('referredBy')}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'TxHash',
      cell: ({ row }) => <div>{row.getValue('wallet')}</div>,
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{row.getValue('timestamp')}</div>,
    },
  ];
  return columns;
};
