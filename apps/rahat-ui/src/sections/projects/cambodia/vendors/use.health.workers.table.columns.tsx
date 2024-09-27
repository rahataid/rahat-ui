import { ColumnDef } from '@tanstack/react-table';

export const useHealthWorkersTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'commissionPayout',
      header: 'Commission Payout',
      cell: ({ row }) => <div>{row.getValue('commissionPayout')}</div>,
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
