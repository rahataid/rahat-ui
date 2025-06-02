import React from 'react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useVendorsTransactionTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.original?.transactionType}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('txHash'))}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={
            row.original?.fspId === null ? 'bg-red-500 ' : 'bg-green-500'
          }
        >
          {row.original?.fspId === null ? 'Offline' : 'Online'}
        </Badge>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div>
          {row?.original?.createdAt
            ? new Date(row?.original?.createdAt).toLocaleString()
            : ''}
        </div>
      ),
    },
  ];
  return columns;
};
