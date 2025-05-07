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
import { useInfoByCurrentChain } from 'apps/rahat-ui/src/hooks/use-info-by-current-chain';

export const useTransactionTable = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();
  const [toAddressCopied, setToAddressCopied] = useState<number>(); // New state for To column
  const chainInfo = useInfoByCurrentChain();

  const clickToCopy = (
    walletAddress: string,
    index: number,
    isToColumn = false,
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
              <p>{row.getValue('from')}</p>
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
              <p>{row.original.beneficiaryWalletAddress}</p>
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
    // {
    //   accessorKey: 'transactionHash',
    //   header: 'Transaction Hash',
    //   cell: ({ row }) => (
    //     <div className="capitalize text-blue-500">
    //       {row?.original?.transactionHash ? (
    //         <Link
    //           target="_blank"
    //           href={`${
    //             chainInfo.blockExplorers?.default.url
    //           }/tx/${row?.original?.transactionHash.toLowerCase()}`}
    //         >
    //           {truncateEthAddress(row.original.transactionHash)}
    //         </Link>
    //       ) : (
    //         'Waiting for approval'
    //       )}
    //     </div>
    //   ),
    // },
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
