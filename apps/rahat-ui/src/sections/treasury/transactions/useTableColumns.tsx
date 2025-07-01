import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export type Transaction = {
  topic: string;
  from: string;
  to: string;
  timestamp: string;
  blockNumber: string;
  transactionHash: string;
  amount: number;
};

export const useTableColumns = () => {
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: '__typename',
      header: 'Topic',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('__typename')}</div>
      ),
    },
    {
      accessorKey: 'from',
      header: 'From',
      cell: ({ row }) => (
        <div className="lowercase">
          {truncateEthAddress(row.getValue('from'))}
        </div>
      ),
    },
    {
      accessorKey: 'to',
      header: 'To',
      cell: ({ row }) => (
        <div className="lowercase">
          {truncateEthAddress(row.getValue('to'))}
        </div>
      ),
    },
    {
      accessorKey: 'blockTimestamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{row.getValue('blockTimestamp')}</div>,
    },
    {
      accessorKey: 'blockNumber',
      header: 'Block Number',
      cell: ({ row }) => <div>{row.getValue('blockNumber')}</div>,
    },
    {
      accessorKey: 'transactionHash',
      header: 'Transaction Hash',
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('transactionHash'))}</div>
      ),
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('value'));

        return <div className="text-right font-medium">{amount} RHT</div>;
      },
    },
  ];
  return columns;
};
