import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { TooltipContent } from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { ColumnDef } from '@tanstack/react-table';
import { formatdbDate } from 'apps/rahat-ui/src/utils';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { ArrowUpDown, Copy, CopyCheck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatEther } from 'viem';
import { Transaction } from './types';
const useTransactionColumn = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();
  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

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
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'desc')
            }
          >
            Timestamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{formatdbDate(row.getValue('date'))}</div>
      ),
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
          href={`https://sepolia.basescan.org/tx/${row.getValue(
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
        const amount = parseFloat(formatEther(BigInt(row.getValue('amount'))));

        // Format the amount in USD without the currency symbol
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'decimal', // Use 'decimal' to remove currency symbol
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);

        return <div className="text-right font-medium">{formatted} USDC</div>;
      },
    },
  ];

  return columns;
};

export default useTransactionColumn;
