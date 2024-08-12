import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const useTransactionTable = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'from',
      header: 'From',
      cell: ({ row }) => (
        <div className="capitalize">
          <Link href={'#'}>{row.getValue('from')}</Link>
        </div>
      ),
    },
    {
      accessorKey: 'to',
      header: 'To',
      cell: ({ row }) => (
        <div>
          <Link href={'#'}> {row.original.beneficiaryWalletAddress}</Link>
        </div>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: 'Transaction Hash',
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
