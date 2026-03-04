import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye, RefreshCcw } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

// function getStatusBg(status: string) {
//   if (status === 'NOT_STARTED') {
//     return 'bg-gray-200';
//   }

//   if (status === 'WORK_IN_PROGRESS') {
//     return 'bg-orange-200';
//   }

//   if (status === 'COMPLETED') {
//     return 'bg-green-200';
//   }

//   if (status === 'DELAYED') {
//     return 'bg-red-200';
//   }

//   return '';
// }

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
      cell: ({ row }) => <TruncatedCell text={row.getValue('title')} />,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge className="rounded-xl capitalize text-xs font-normal text-muted-foreground">
          <TruncatedCell text={row.getValue('category')} maxLength={15} />
        </Badge>
      ),
    },

    {
      accessorKey: 'isAutomated',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className="rounded-xl capitalize  text-xs font-normal text-muted-foreground">
          {row.getValue('isAutomated') ? 'Automated' : 'Manual'}
        </Badge>
      ),
    },
    {
      accessorKey: 'responsibility',
      header: 'Responsibility',
      cell: ({ row }) => <div>{row.getValue('responsibility')}</div>,
    },
    {
      accessorKey: 'source',
      header: 'Responsible Station ',
      cell: ({ row }) => <TruncatedCell text={row.getValue('source')} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const bgColor = getStatusBg(status);
        return (
          <Badge
            className={`rounded-xl capitalize text-xs font-normal ${bgColor}`}
          >
            <TruncatedCell text={status} maxLength={10} />
          </Badge>
        );
      },
    },
    {
      accessorKey: 'completedBy',
      header: 'Completed By',
      cell: ({ row }) => {
        const completedBy = row.getValue('completedBy') as string;
        return <TruncatedCell text={completedBy || 'N/A'} />;
      },
    },
    {
      accessorKey: 'completedAt',
      header: 'Timestamp',
      cell: ({ row }) => {
        const completedAt = row.getValue('completedAt') as string;
        if (completedAt) {
          const d = new Date(completedAt);
          const localeDate = d.toLocaleDateString();
          const localeTime = d.toLocaleTimeString();
          return <TruncatedCell text={`${localeDate} ${localeTime}`} />;
        }
        return 'N/A';
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Action',
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
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
              hasContent={false}
            >
              <TooltipComponent
                Icon={RefreshCcw}
                tip="Update"
                iconStyle="hover:text-primary cursor-pointer"
                handleOnClick={() =>
                  handleUpdateStatusIconClick(row.original.id)
                }
              />
            </RoleAuth>
          </div>
        );
      },
    },
  ];

  return columns;
}
