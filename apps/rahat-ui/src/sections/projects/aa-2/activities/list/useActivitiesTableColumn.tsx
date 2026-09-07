import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye, RefreshCcw } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { Can } from 'apps/rahat-ui/src/components/can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

export default function useActivitiesTableColumn() {
  const { id: projectID, title } = useParams();
  const router = useRouter();

  const handleEyeClick = (activityId: any) => {
    setPaginationToLocalStorage();
    router.push(
      `/projects/aa/${projectID}/activities/${activityId}?from=${title}`,
    );
  };

  const handleUpdateStatusIconClick = (activityId: any) => {
    router.push(
      `/projects/aa/${projectID}/activities/${activityId}/update-status?from=${title}`,
    );
  };

  const columns: ColumnDef<IActivitiesItem>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      meta: { className: 'w-[250px]' },
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('title')} truncateByWidth />
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      meta: { className: 'w-[130px]' },
      cell: ({ row }) => (
        <Badge className="rounded-xl capitalize text-xs font-normal text-muted-foreground">
          <TruncatedCell text={row.getValue('category')} maxLength={15} />
        </Badge>
      ),
    },

    {
      accessorKey: 'isAutomated',
      header: 'Type',
      meta: { className: 'w-[80px]' },
      cell: ({ row }) => (
        <Badge className="rounded-xl capitalize  text-xs font-normal text-muted-foreground">
          {row.getValue('isAutomated') ? 'Automated' : 'Manual'}
        </Badge>
      ),
    },
    {
      accessorKey: 'responsibility',
      header: 'Responsibility',
      meta: { className: 'w-[130px]' },
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('responsibility') || 'N/A'}
          maxLength={15}
        />
      ),
    },
    {
      accessorKey: 'responsibleStation',
      header: 'Responsible Station ',
      meta: { className: 'w-[120px]' },
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('responsibleStation') || 'N/A'}
          maxLength={10}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { className: 'w-[100px]' },
      cell: ({ row }) => {
        const rawStatus = row.getValue('status') as string;
        const status = rawStatus
          .toLowerCase()
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return (
          <Badge className={getStatusBg(status)}>
            <TruncatedCell text={status} maxLength={10} />
          </Badge>
        );
      },
    },
    {
      header: 'Completed By',
      meta: { className: 'w-[110px]' },
      cell: ({ row }) => {
        const completedBy = row.original.completedBy;
        const completedAt = row.original.completedAt;
        return (
          <div className="flex flex-col text-xs">
            <span className="text-muted-foreground">
              {completedBy || 'N/A'}
            </span>
            <span className="text-muted-foreground">
              {completedAt ? dateFormat(completedAt) : 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Action',
      meta: { className: 'w-[60px]' },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            {/* <UpdateActivityStatusDialog
              activityDetail={row.original}
              loading={false}
              iconStyle="w-4 h-4"
            /> */}
            <TooltipComponent
              Icon={Eye}
              tip="View Details"
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleEyeClick(row.original.id)}
            />
            <Can action={ACTIONS.UPDATE} subject={SUBJECTS.ACTIVITY}>
              <TooltipComponent
                Icon={RefreshCcw}
                tip="Update Activity Status"
                iconStyle="hover:text-primary cursor-pointer"
                handleOnClick={() =>
                  handleUpdateStatusIconClick(row.original.id)
                }
              />
            </Can>
          </div>
        );
      },
    },
  ];

  return columns;
}
