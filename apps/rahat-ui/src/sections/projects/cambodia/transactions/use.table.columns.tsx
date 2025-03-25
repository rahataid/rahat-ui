'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Copy, CopyCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useCambodiaProjectSettings } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import Link from 'next/link';
export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
  processedBy: string;
};
export const useTableColumns = () => {
  const { id } = useParams() as { id: UUID };
  const { data: settings } = useCambodiaProjectSettings({
    projectUUID: id,
    name: 'EXPLORER_URL',
  }) as any;
  const [copiedCells, setCopiedCells] = useState<string | null>(null);

  const clickToCopy = (value: string, rowIndex: number, columnKey: string) => {
    navigator.clipboard.writeText(value);

    const cellKey = `${rowIndex}-${columnKey}`;

    setCopiedCells(cellKey);
    setTimeout(() => {
      setCopiedCells(null);
    }, 3000);
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
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      accessorFn: (row) => row.processedBy,
      cell: ({ row }) => {
        const columnKey = 'walletAddress';
        const cellKey = `${row.index}-${columnKey}`;
        return (
          <div className="lowercase ml-3">
            {row.getValue('walletAddress') ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger
                    className="flex gap-3 cursor-pointer"
                    onClick={() =>
                      clickToCopy(
                        row.getValue('walletAddress'),
                        row.index,
                        columnKey,
                      )
                    }
                  >
                    <p className="text-sm">
                      {truncateEthAddress(row.getValue('walletAddress'))}
                    </p>
                    <span className="ml-1">
                      {copiedCells === cellKey ? (
                        <CopyCheck size={20} strokeWidth={1.5} />
                      ) : (
                        <Copy size={20} strokeWidth={1.5} />
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary" side="bottom">
                    <p className="text-xs font-medium">
                      {copiedCells === cellKey ? 'Copied' : 'Click to copy'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              '-'
            )}
          </div>
        );
      },
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
    // {
    //   accessorKey: 'txHash',
    //   header: 'TxHash',
    //   cell: ({ row }) => {
    //     const columnKey = 'txHash';
    //     const cellKey = `${row.index}-${columnKey}`;
    //     return (
    //       <div className="lowercase">
    //         {row.getValue('txHash') ? (
    //           <TooltipProvider delayDuration={100}>
    //             <Tooltip>
    //               <TooltipTrigger
    //                 className="flex gap-3 cursor-pointer"
    //                 onClick={() =>
    //                   clickToCopy(row.getValue('txHash'), row.index, columnKey)
    //                 }
    //               >
    //                 <p>{truncateEthAddress(row.getValue('txHash'))}</p>
    //                 {copiedCells === cellKey ? (
    //                   <CopyCheck size={20} strokeWidth={1.5} />
    //                 ) : (
    //                   <Copy size={20} strokeWidth={1.5} />
    //                 )}
    //               </TooltipTrigger>
    //               <TooltipContent className="bg-secondary" side="bottom">
    //                 <p className="text-xs font-medium">
    //                   {copiedCells === cellKey ? 'Copied' : 'Click to copy'}
    //                 </p>
    //               </TooltipContent>
    //             </Tooltip>
    //           </TooltipProvider>
    //         ) : (
    //           '-'
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      id: 'actions',
      header: 'Tx Details',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Link
            href={`${settings?.data?.value?.url}/tx/${row.original?.txHash}`}
            target="_blank"
          >
            <Button className="flex items-center gap-2" variant={'ghost'}>
              View
            </Button>
          </Link>
        );
      },
    },
  ];
  return columns;
};
