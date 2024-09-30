import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { Copy, CopyCheck } from 'lucide-react';

export const useTransactionHistoryTableColumns = () => {
  const [copyAction, setCopyAction] = useState<number>();
  const clickToCopy = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopyAction(index);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Topic',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },

    {
      accessorKey: 'wallet',
      header: 'TxHash',
      cell: ({ row }) => (
        <>
          {row.getValue('wallet') ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex gap-3 cursor-pointer"
                  onClick={() => clickToCopy(row.getValue('wallet'), row.index)}
                >
                  <p>{truncateEthAddress(row.getValue('wallet'))}</p>
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
            'N/A'
          )}
        </>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{row.getValue('timestamp')}</div>,
    },
  ];
  return columns;
};
