import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { ArrowUpDown, Copy, CopyCheck } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};

export const useTransactionHistoryTableColumns = () => {
  const [copyAction, setCopyAction] = useState<number>();
  const clickToCopy = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopyAction(index);
  };
  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.getValue('topic')}</div>,
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
  ];
  return columns;
};
