import { ColumnDef } from '@tanstack/react-table';

export default function useDetailsBeneficiaryTableColumn() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => row.getValue('name') || '-',
    },
    {
      accessorKey: 'walletAddress',
      header: 'WalletAddress',
      cell: ({ row }) => row.getValue('walletAddress') || '-',
    },
    {
      accessorKey: 'tokenAmount',
      header: 'Token Amount',
      cell: ({ row }) => row.getValue('tokenAmount') || '-',
    },
  ];

  return columns;
}
