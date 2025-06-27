import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaVendorsTransactionsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.getValue('topic')}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('txHash'))}</div>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div>
          {row?.original?.timeStamp
            ? new Date(row?.original?.timeStamp).toLocaleString()
            : ''}
        </div>
      ),
    },
  ];
  return columns;
};
