import { truncateEthAddress } from '@rumsan/sdk/utils';
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
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{row.getValue('timeStamp')}</div>,
    },
  ];
  return columns;
};