'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { formatDate } from 'apps/community-tool-ui/src/utils';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useParams, useRouter } from 'next/navigation';
import { StatusChip, PriorityChip, TypeChip } from './components';

export const useGrievancesTableColumns = () => {
  const router = useRouter();
  const { id } = useParams();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div> {row.getValue('title')}</div>,
    },
    {
      accessorKey: 'reportedBy',
      header: 'Reporter',
      cell: ({ row }) => <div> {row.getValue('reportedBy')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div>
          <TypeChip type={row.getValue('type')} showIcon={false} />
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          <StatusChip status={row.getValue('status')} showIcon={false} />
        </div>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <div>
          <PriorityChip priority={row.getValue('priority')} showIcon={false} />
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => <div> {formatDate(row.getValue('createdAt'))}</div>,
    },
    {
      id: 'action',
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
                  `/projects/aa/${id}/grievances/${row.original.uuid}`,
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
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row?.original?.walletAddress, row?.original?.uuid)
              }
            >
              <p>{truncateEthAddress(row?.original?.walletAddress)}</p>
              {copyAction === row?.original?.uuid ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {copyAction === row?.original?.uuid
                  ? 'copied'
                  : 'click to copy'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
