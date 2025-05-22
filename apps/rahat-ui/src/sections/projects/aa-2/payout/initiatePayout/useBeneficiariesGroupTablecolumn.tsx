import { ColumnDef } from '@tanstack/react-table';

export default function useBeneficiariesGroupTableColumn() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <div className="w-80">{row?.original?.walletAddress}</div>
      ),
    },
    {
      accessorKey: 'assignedTokens',
      header: 'Token Assigned',
      cell: ({ row }) => <div>{row?.original?.assignedTokens}</div>,
    },
  ];

  return columns;
}
