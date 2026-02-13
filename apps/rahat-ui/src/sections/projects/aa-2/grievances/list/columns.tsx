'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useParams, useRouter } from 'next/navigation';
import { StatusChip, PriorityChip, TypeChip } from '../components';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import GrievanceDetailSplitView from '../details/grievance.detail.split.view';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { formatDateFull } from 'apps/rahat-ui/src/utils/dateFormate';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
interface GrievanceTableRow {
  id: string;
  title: string;
  reportedBy: string;
  type: string;
  createdByUser: {
    name: string;
  };
  createdAt: string;
  priority: string;
  status: string;
}
export const useGrievancesTableColumns = () => {
  const { setSecondPanelComponent } = useSecondPanel();

  const openSplitDetailView = (grievance: GrievanceTableRow) => {
    setSecondPanelComponent(<GrievanceDetailSplitView grievance={grievance} />);
  };

  const columns: ColumnDef<GrievanceTableRow>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div> {row.getValue('id')}</div>,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('title')} maxLength={30} />
      ),
    },
    {
      accessorKey: 'reportedBy',
      header: 'Reported By',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('reportedBy')} maxLength={30} />
      ),
    },
    {
      accessorKey: 'type',
      header: 'Grievance Type',
      cell: ({ row }) => (
        <div>
          <TypeChip type={row.getValue('type')} showIcon={false} />
        </div>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.createdByUser?.name}
          maxLength={30}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created On',
      cell: ({ row }) => (
        <TruncatedCell
          text={formatDateFull(row.getValue('createdAt'))}
          maxLength={25}
        />
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          <StatusChip status={row.getValue('status')} showIcon={false} />
        </div>
      ),
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
              onClick={() => openSplitDetailView(row.original)}
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
