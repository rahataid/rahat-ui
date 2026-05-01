import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { formatDateFromBloackChain } from 'apps/rahat-ui/src/utils';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, CopyCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mapTopic } from '../const';

export const useElkenyaTransactionsTableColumns = ({ setSorting }: any) => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<string>();

  const clickToCopy = (walletAddress: string, uuid: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(uuid);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiary',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row.getValue('beneficiary'), row?.original?.uuid)
              }
            >
              <p>{truncateEthAddress(row.getValue('beneficiary'))}</p>
              {walletAddressCopied &&
              walletAddressCopied === row?.original?.uuid ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {walletAddressCopied &&
                walletAddressCopied === row?.original?.uuid
                  ? 'copied'
                  : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{mapTopic(row.getValue('topic'))}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <Link
          target="_blank"
          href={`https://sepolia.basescan.org/tx/${row.getValue('txHash')}`}
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
