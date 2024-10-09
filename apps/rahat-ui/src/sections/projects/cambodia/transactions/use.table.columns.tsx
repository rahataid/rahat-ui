'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};
export const useTableColumns = () => {
  const [copyAction, setCopyAction] = useState<number>();
  const clickToCopy = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopyAction(index);
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
      accessorKey: 'processedBy',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Wallet Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => (
        <div className="lowercase ml-3">
          {row.getValue('processedBy') ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 cursor-pointer"
                  onClick={() =>
                    clickToCopy(row.getValue('processedBy'), row.index)
                  }
                >
                  <p className="text-sm">
                    {truncateEthAddress(row.getValue('processedBy'))}
                  </p>
                  <span className="ml-1">
                    {copyAction === row.index ? (
                      <CopyCheck size={20} strokeWidth={1.5} />
                    ) : (
                      <Copy size={20} strokeWidth={1.5} />
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {copyAction === row.index ? 'copied' : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    // {
    //   accessorKey: 'voucherId',
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //       >
    //         VoucherId
    //         <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   cell: ({ row }) => (
    //     <div className="lowercase">
    //       {truncateEthAddress(row.getValue('voucherId'))}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'timeStamp',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Timestamp
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('timeStamp'));
        const formattedDate = date.toLocaleDateString();

        return <div className="lowercase ml-4">{formattedDate}</div>;
      },
    },
    {
      accessorKey: 'txHash',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            TxHash
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue('txHash') ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 cursor-pointer"
                  onClick={() => clickToCopy(row.getValue('txHash'), row.index)}
                >
                  <p>{truncateEthAddress(row.getValue('txHash'))}</p>
                  {copyAction === row.index ? (
                    <CopyCheck size={20} strokeWidth={1.5} />
                  ) : (
                    <Copy size={20} strokeWidth={1.5} />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {copyAction === row.index ? 'copied' : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            '-'
          )}
        </div>
      ),
    },
  ];
  return columns;
};
