import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';

export const useFMDetailTableColumns = () => {
  const { id, fundId } = useParams();
  const router = useRouter();
  const { clickToCopy, copyAction } = useCopy();
  const handleViewClick = (fmId: string) => {
    console.log('benefwallet', fmId);
    router.push(`/projects/aa/${id}/beneficiary/${fmId}?fundId=${fundId}`);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      accessorFn: (row) => row.Beneficiary?.walletAddress ?? 'N/A',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell
            text={row.original?.Beneficiary?.walletAddress}
            maxLength={15}
          />
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  clickToCopy(
                    row.original?.Beneficiary?.walletAddress,
                    row?.original?.uuid,
                  )
                }
              >
                {copyAction === row?.original?.uuid ? (
                  <CopyCheck size={15} strokeWidth={1.5} />
                ) : (
                  <Copy
                    className="text-slate-500"
                    size={15}
                    strokeWidth={1.5}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent className=" rounded-sm" side="bottom">
                <p className="text-xs font-medium">
                  {copyAction === row?.original?.uuid
                    ? 'copied'
                    : 'click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: 'tokensAssigned',
      header: 'Tokens Assigned',
      cell: ({ row }) => <div>{row.original?.tokensReserved || 'N/A'}</div>,
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
              onClick={() => handleViewClick(row.original.beneficiaryId)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
