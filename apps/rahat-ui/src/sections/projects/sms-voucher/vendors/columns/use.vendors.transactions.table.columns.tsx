import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { formatDateFromBloackChain } from 'apps/rahat-ui/src/utils';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { mapTopic } from '../../const';

export const useElkenyaVendorsTransactionsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{mapTopic(row.getValue('topic'))}</div>,
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
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Timestamp
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp size={16} />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown size={16} />
          ) : (
            <ArrowUpDown size={16} />
          )}
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <div>{formatDateFromBloackChain(row.getValue('timeStamp'))}</div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId)).getTime();
        const dateB = new Date(rowB.getValue(columnId)).getTime();

        return dateA - dateB;
      },
      sortDescFirst: true,
    },
  ];
  return columns;
};
