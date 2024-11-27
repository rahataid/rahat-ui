import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useState } from 'react';
export const useCambodiaVendorsTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const [copiedCells, setCopiedCells] = useState<string | null>(null);

  const clickToCopy = (value: string, rowIndex: number, columnKey: string) => {
    navigator.clipboard.writeText(value);

    const cellKey = `${rowIndex}-${columnKey}`;

    setCopiedCells(cellKey);
    setTimeout(() => {
      setCopiedCells(null);
    }, 3000);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row?.original?.name}</div>,
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
        const columnKey = 'wallet';
        const cellKey = `${row.index}-${columnKey}`;
        return (
          <div className="lowercase ml-3">
            {row?.original?.wallet ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger
                    className="flex gap-3 cursor-pointer"
                    onClick={() =>
                      clickToCopy(row?.original?.wallet, row.index, columnKey)
                    }
                  >
                    <p className="text-sm truncate w-16">
                      {row?.original?.wallet}
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
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/el-cambodia/${id}/vendors/${row.original.vendorId}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
