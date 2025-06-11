import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

function getTransactionStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-200 text-green-800';
    case 'pending':
      return 'bg-blue-200 text-blue-800';
    case 'rejected':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

export default function useBeneficiaryGroupDetailsLogColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Beneficiary Wallet Address',
      cell: ({ row }) => (
        <div className="truncate max-w-[180px]">
          {row.getValue('walletAddress')}
        </div>
      ),
    },
    {
      accessorKey: 'transactionWalletId',
      header: 'Transaction Wallet ID',
      cell: ({ row }) => <div>{row.getValue('transactionWalletId')}</div>,
    },
    {
      accessorKey: 'bankTransactionId',
      header: 'Bank Transaction ID',
      cell: ({ row }) => <div>{row.getValue('bankTransactionId')}</div>,
    },
    {
      accessorKey: 'tokensAssigned',
      header: 'Tokens Assigned',
      cell: ({ row }) => <div>{row.getValue('tokensAssigned')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row?.original?.status;
        return (
          <Badge
            className={`rounded-xl capitalize ${getTransactionStatusColor(
              status,
            )}`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('timeStamp')).toLocaleString()}</div>
      ),
    },
  ];

  return columns;
}
