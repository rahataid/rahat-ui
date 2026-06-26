import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, Eye, TriangleAlert } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@rahat-ui/shadcn/src/components/ui/collapsible';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

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
        <TruncatedCell text={row?.original?.title || 'N/A'} maxLength={10} />
      ),
    },
    {
      accessorKey: 'beneficiaryGroup',
      header: 'Beneficiary Group',
      cell: ({ row }) => {
        return (
          <TruncatedCell
            text={row.original?.group?.name || 'N/A'}
            maxLength={15}
          />
        );
      },
    },
    {
      accessorKey: 'tokens',
      header: 'Total Tokens',
      cell: ({ row }) => <div>{row?.original?.numberOfTokens}</div>,
    },
    {
      accessorKey: 'tokensperBenef',
      header: 'Token Per Beneficiary',
      cell: ({ row }) => (
        <div>
          {row?.original?.numberOfTokens /
            row.original.group.groupedBeneficiaries.length}
        </div>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('createdBy') || 'N/A'}
          maxLength={15}
        />
      ),
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
            <TooltipComponent
              Icon={Eye}
              tip="View Details"
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleViewClick(row.original.uuid)}
            />
            {(status === FundStatus.FAILED || status === FundStatus.ERROR) && (
              <HoverCard openDelay={100}>
                <HoverCardTrigger asChild>
                  <button type="button" aria-label="View failure details">
                    <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent side="left" className="rounded-sm w-72">
                  <div className="flex space-x-2 items-center">
                    <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                    <span className="font-semibold text-sm/6">
                      Token disbursement failed for this group. Contact
                      admin for assistance.
                    </span>
                  </div>
                  <Collapsible className="mt-2">
                    <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                      <ChevronDown size={12} />
                      View technical details
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="text-gray-500 text-xs mt-2 break-words">
                        {row.original?.info?.error ?? 'Something went wrong!!'}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
};
