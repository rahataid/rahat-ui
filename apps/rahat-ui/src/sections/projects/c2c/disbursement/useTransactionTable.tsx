import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useState } from 'react';
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { Copy, CopyCheck } from 'lucide-react';

export const useTransactionTable = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();
  const [toAddressCopied, setToAddressCopied] = useState<number>(); // New state for To column

  const clickToCopy = (
    walletAddress: string,
    index: number,
    isToColumn: boolean = false,
  ) => {
    navigator.clipboard.writeText(walletAddress);
    if (isToColumn) {
      setToAddressCopied(index);
    } else {
      setWalletAddressCopied(index);
    }
  };

  const columns: ColumnDef<any>[] = [
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
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(
                  row.original.beneficiaryWalletAddress,
                  row.index,
                  true,
                )
              }
            >
              <p>{truncateEthAddress(row.original.beneficiaryWalletAddress)}</p>
              {toAddressCopied === row.index ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {toAddressCopied === row.index ? 'copied' : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'transactionHash',
      header: 'Transaction Hash',
      cell: ({ row }) => (
        <div className="capitalize text-blue-500">
          <Link
            target="_blank"
            href={`https://sepolia.basescan.org/tx/${row.original.transactionHash}`}
          >
            {row.original.transactionHash}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => <div>Amount</div>,
      cell: ({ row }) => {
        const amount = row.getValue('amount');

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
  ];
  return columns;
};
