import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useInfoByCurrentChain } from 'apps/rahat-ui/src/hooks/use-info-by-current-chain';
import { formatDateFromBloackChain } from 'apps/rahat-ui/src/utils';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';

export const useElkenyaTransactionsTableColumns = ({ setSorting }: any) => {
  const chainInfo = useInfoByCurrentChain();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiary',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <div>{truncateEthAddress(row.getValue('beneficiary'))}</div>
      ),
    },
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.getValue('topic')}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <Link
          target="_blank"
          href={`${chainInfo.blockExplorers?.default.url}/tx/${row.getValue(
            'txHash',
          )}`}
          className="capitalize text-blue-500"
        >
          {shortenTxHash(row.getValue('txHash'))}
        </Link>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        const handleSort = () => {
          setSorting((prevSorting: any) => {
            const currentSort = prevSorting.find(
              (s: any) => s.id === 'timeStamp',
            );
            return [{ id: 'timeStamp', desc: !currentSort?.desc }];
          });
        };

        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleSort}
          >
            Timestamp
            {isSorted === 'asc' ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown size={16} />
            )}
          </div>
        );
      },
      enableSorting: true,
      cell: ({ row }) => (
        <div>{formatDateFromBloackChain(row.getValue('timeStamp'))}</div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId)).getTime();
        const dateB = new Date(rowB.getValue(columnId)).getTime();

        return dateA - dateB;
      },
    },
  ];
  return columns;
};
