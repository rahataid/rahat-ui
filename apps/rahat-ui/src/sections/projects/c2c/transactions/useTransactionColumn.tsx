import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { TooltipContent } from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  formatDateFromBloackChain,
  formatdbDate,
} from 'apps/rahat-ui/src/utils';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, CopyCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatEther, parseUnits } from 'viem';
import { Transaction } from './types';
import { useTokenDetails } from '@rahat-ui/query';
import { useInfoByCurrentChain } from 'apps/rahat-ui/src/hooks/use-info-by-current-chain';
const useTransactionColumn = ({ setSorting }: any) => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();
  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };
  const chainInfo = useInfoByCurrentChain();
  const tokenDetails = useTokenDetails();

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('topic')}</div>
      ),
    },
    {
      accessorKey: 'from',
      header: 'From',
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => clickToCopy(row.getValue('from'), row.index)}
            >
              <p>{truncateEthAddress(row.getValue('from'))}</p>
              {walletAddressCopied === row.index ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {walletAddressCopied === row.index ? 'copied' : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'to',
      header: 'To',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('to') || 'C2C'}</div>
      ),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => {
        const isSorted = column.getIsSorted();

        const handleSort = () => {
          setSorting((prevSorting: any) => {
            const currentSort = prevSorting.find((s: any) => s.id === 'date');
            return [{ id: 'date', desc: !currentSort?.desc }];
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
        <div>{formatDateFromBloackChain(row.getValue('date'))}</div>
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId)).getTime();
        const dateB = new Date(rowB.getValue(columnId)).getTime();

        return dateA - dateB;
      },
    },
    {
      accessorKey: 'blockNumber',
      header: 'Block Number',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('blockNumber')}</div>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: 'TransactionHash',
      cell: ({ row }) => (
        <Link
          target="_blank"
          href={`${chainInfo.blockExplorers?.default.url}/tx/${row.getValue(
            'transactionHash',
          )}`}
          className="capitalize text-blue-500"
        >
          {shortenTxHash(row.getValue('transactionHash'))}
        </Link>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.getValue('amount')} USDC
          </div>
        );
      },
    },
  ];

  return columns;
};

export default useTransactionColumn;
