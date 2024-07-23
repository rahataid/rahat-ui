import { ColumnDef } from '@tanstack/react-table';

export const useTransactionTable = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'from',
      header: 'From',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('from')}</div>
      ),
    },
    {
      accessorKey: 'to',
      header: 'To',
      cell: ({ row }) => <div>{row.original.beneficiaryWalletAddress}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return <div>{row.getValue('amount')}</div>;
      },
    },
  ];
  return columns;
};
