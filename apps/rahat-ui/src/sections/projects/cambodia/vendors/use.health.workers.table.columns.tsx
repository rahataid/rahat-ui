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
  const [walletAddressCopied, setWalletAddressCopied] = useState<string>();

  const clickToCopy = (walletAddress: string, id: string) => {
    console.log('asdq', walletAddress, id);
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(id);
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
      cell: ({ row }) => {
        return (
          <>
            {row?.original?.walletAddress ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger
                    className="flex gap-3 cursor-pointer"
                    onClick={() =>
                      clickToCopy(row?.original?.walletAddress, row.id)
                    }
                  >
                    <p className="truncate w-16">
                      {row?.original?.walletAddress}
                    </p>
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
        );
      },
    },
  ];
  return columns;
};
