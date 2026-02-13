'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useParams, useRouter } from 'next/navigation';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { TruncatedCell } from '../stakeholders/component/TruncatedCell';

export const useProjectBeneficiaryTableColumns = () => {
  const router = useRouter();
  const { id } = useParams();

  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'wallet',
      header: 'Wallet',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row?.original?.walletAddress} maxLength={15} />
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  clickToCopy(row.original?.walletAddress, row?.original?.uuid)
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
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div> {row.getValue('gender')}</div>,
    },
    {
      id: 'actions',
      header: 'Action',
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
                  `/projects/aa/${id}/beneficiary/${row.original.uuid}`,
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

export const useProjectBeneficiaryGroupDetailsTableColumns = () => {
  const router = useRouter();
  const { id, groupId } = useParams();

  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TruncatedCell text={row?.original?.walletAddress} maxLength={15} />
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex items-center gap-3 cursor-pointer"
                onClick={() =>
                  clickToCopy(row.original?.walletAddress, row?.original?.uuid)
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
      id: 'actions',
      header: 'Action',
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);

        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/beneficiary/${row?.original?.benefId}?groupId=${groupId}`,
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
