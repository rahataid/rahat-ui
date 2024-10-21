import { ColumnDef } from '@tanstack/react-table';

export const useHealthWorkersTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Health Worker Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'commissionPayout',
      header: 'Commission Payout',
      cell: ({ row }) => <div>{row.getValue('commissionPayout') ?? '-'}</div>,
    },
    {
      accessorKey: 'koboUsername',
      header: 'Kobo Username',
      cell: ({ row }) => <div>{row?.original?.koboUsername}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row?.original?.phone}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet Address',
      cell: ({ row }) => <div>{row?.original?.walletAddress}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => {
        return <div>{row?.original?.gender}</div>;
      },
    },
  ];
  return columns;
};
