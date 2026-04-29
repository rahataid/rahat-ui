'use client';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Copy, CopyCheck } from 'lucide-react';
export const useConversionListTableColumns = () => {
  const [walletAddressCopied, setWalletAddressCopied] = useState<string | null>(
    null,
  );

  // const clickToCopy = (walletAddress: string, id: string) => {
  //   navigator.clipboard.writeText(walletAddress);
  //   setWalletAddressCopied(id);
  // };
  const clickToCopy = (
    walletAddress: string,
    id: number,
    columnKey: string,
  ) => {
    navigator.clipboard.writeText(walletAddress);
    const cellKey = `${id}-${columnKey}`;
    setWalletAddressCopied(cellKey);
    setTimeout(() => {
      setWalletAddressCopied(null);
    }, 500);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row?.original?.pii?.name ?? '-'}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <Badge>{row?.original?.pii?.phone ?? '-'}</Badge>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => {
        const columnKey = 'walletAddress';
        const cellKey = `${row.index}-${columnKey}`;
        return (
          <>
            {row?.original?.beneficiary?.walletAddress ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger
                    className="flex gap-3 cursor-pointer"
                    onClick={() =>
                      clickToCopy(
                        row?.original?.beneficiary?.walletAddress,
                        row.index,
                        columnKey,
                      )
                    }
                  >
                    <p className="truncate w-16">
                      {row?.original?.beneficiary?.walletAddress}
                    </p>
                    {walletAddressCopied === cellKey ? (
                      <CopyCheck size={20} strokeWidth={1.5} />
                    ) : (
                      <Copy size={20} strokeWidth={1.5} />
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary" side="bottom">
                    <p className="text-xs font-medium">
                      {walletAddressCopied === cellKey
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
