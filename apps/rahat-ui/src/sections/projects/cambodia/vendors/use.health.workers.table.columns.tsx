'use client';
import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';
export const useHealthWorkersTableColumns = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Health Worker Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'commissionPayout',
      header: 'Commission Payout',
      cell: ({ row }) => <div>{row.getValue('commissionPayout') ?? '-'}</div>,
    },
    {
      accessorKey: 'koboUsername',
      header: 'Kobo Username',
      cell: ({ row }) => <div>{row?.original?.koboUsername}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row?.original?.phone}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <>
          {row?.original?.walletAddress ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 cursor-pointer"
                  onClick={() =>
                    clickToCopy(row?.original?.walletAddress, row.index)
                  }
                >
                  <p className="truncate w-16">
                    {row?.original?.walletAddress}
                  </p>
                  {walletAddressCopied === row.index ? (
                    <CopyCheck size={20} strokeWidth={1.5} />
                  ) : (
                    <Copy size={20} strokeWidth={1.5} />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {walletAddressCopied === row.index
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
  ];
  return columns;
};
