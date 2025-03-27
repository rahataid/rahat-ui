'use client';
import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react';
export const useTransactionHistoryTableColumns = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<string>();

  const clickToCopy = (walletAddress: string, id: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(id);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row?.original?.topic}</div>,
    },
    {
      accessorKey: 'beneficiary',
      header: 'Wallet',
      cell: ({ row }) => (
        <p className="truncate w-16">{row?.original?.beneficiary}</p>
      ),
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => (
        <>
          {row?.original?.txHash ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 cursor-pointer"
                  onClick={() => clickToCopy(row?.original?.txHash, row.id)}
                >
                  <p className="truncate w-24">{row?.original?.txHash}</p>
                  {walletAddressCopied === row.id ? (
                    <CopyCheck size={20} strokeWidth={1.5} />
                  ) : (
                    <Copy size={20} strokeWidth={1.5} />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {walletAddressCopied === row.id
                      ? 'copied'
                      : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            'N/A'
          )}
        </>
      ),
    },
    {
      accessorKey: 'timeStamp',
      header: 'Time Stamp',
      cell: ({ row }) => <div>{row?.original?.timeStamp}</div>,
    },
  ];
  return columns;
};
