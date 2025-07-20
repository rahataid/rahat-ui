import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, TriangleAlert } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IFundManagement } from '../types';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export enum FundStatus {
  NOT_DISBURSED = 'NOT_DISBURSED',
  DISBURSED = 'DISBURSED',
  STARTED = 'STARTED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
}

export const useFundManagementTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (fmId: string) => {
    router.push(`/projects/aa/${id}/fund-management/${fmId}`);
  };

  function renderBadgeStyle(status: FundStatus) {
    if (status === FundStatus.FAILED || status === FundStatus.ERROR) {
      return 'bg-red-100 text-red-500';
    }
    if (status === FundStatus.DISBURSED) {
      return 'bg-green-100 text-green-500';
    }
    if (status === FundStatus.STARTED) {
      return 'bg-blue-100 text-blue-500';
    }
    return 'bg-gray-200';
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      accessorFn: (row) => row?.title,
      header: 'Title',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-48 hover:cursor-pointer">
                {row?.original?.title || 'N/A'}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row?.original?.title || 'N/A'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'beneficiaryGroup',
      header: 'Beneficiary Group',
      cell: ({ row }) => {
        return <div>{row.original?.group?.name || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'tokens',
      header: 'Tokens',
      cell: ({ row }) => <div>{row?.original?.numberOfTokens}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => <div>{row.getValue('createdBy') || 'N/A'}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as FundStatus;

        return (
          <Badge className={renderBadgeStyle(status)}>
            {status.replace(/_/g, ' ') || 'N/A'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.getValue('status') as FundStatus;
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() => handleViewClick(row.original.uuid)}
            />
            {(status === FundStatus.FAILED || status === FundStatus.ERROR) && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="rounded-sm w-64">
                    <div className="flex space-x-2 items-center">
                      <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                      <span className="font-semibold text-sm/6">
                        Transaction Failed
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {row.original?.info?.error ?? 'Something went wrong!!'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
};
