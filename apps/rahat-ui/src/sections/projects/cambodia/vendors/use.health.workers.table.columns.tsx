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
      cell: ({ row }) => <div>{row.getValue('commissionPayout') ?? '-'}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'TxHash',
      cell: ({ row }) => <div>{row.original?.walletAddress}</div>,
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        const formattedDate = date.toLocaleDateString();

        return <div className="lowercase ml-4">{formattedDate}</div>;
      },
    },
  ];
  return columns;
};
