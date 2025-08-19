import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Eye, RefreshCcw } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { AARoles, RoleAuth } from '@rahat-ui/auth';

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
    router.push(`/projects/aa/${projectID}/activities/${activityId}`);
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
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-48 hover:cursor-pointer">
                {row.getValue('title')}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row.getValue('title')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge className="rounded-xl capitalize text-xs font-normal text-muted-foreground">
          {row.getValue('category')}
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
      header: 'Responsible Station',
      cell: ({ row }) => <div>{row.getValue('source')}</div>,
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
            {status
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'completedBy',
      header: 'Completed By',
      cell: ({ row }) => {
        const completedBy = row.getValue('completedBy') as string;
        return <div className="">{completedBy || 'N/A'}</div>;
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
          return `${localeDate} ${localeTime}`;
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
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() => handleEyeClick(row.original.id)}
            />
            <RoleAuth
              roles={[AARoles.ADMIN, AARoles.MANAGER]}
              hasContent={false}
            >
              <RefreshCcw
                className="hover:text-primary cursor-pointer"
                size={20}
                strokeWidth={1.5}
                onClick={() => handleUpdateStatusIconClick(row.original.id)}
              />
            </RoleAuth>
          </div>
        );
      },
    },
  ];

  return columns;
}
