import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import UpdateActivityStatusDialog from '../details/update.activity.status.dialog';
import { setPaginationToLocalStorage } from '../../prev.pagination.storage';

function getPhaseBg(phase: string) {
  if (phase === 'PREPAREDNESS') {
    return 'bg-yellow-200';
  }

  if (phase === 'READINESS') {
    return 'bg-green-200';
  }

  if (phase === 'ACTIVATION') {
    return 'bg-red-200';
  }

  return '';
}

function getStatusBg(status: string) {
  if (status === 'NOT_STARTED') {
    return 'bg-gray-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-red-200';
  }

  return '';
}

export default function useActivitiesTableColumn() {
  const { id: projectID } = useParams();
  const router = useRouter();

  const handleEyeClick = (activityId: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectID}/activities/${activityId}`);
  };

  const columns: ColumnDef<IActivitiesItem>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div className="w-80">{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize w-max text-muted-foreground">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'phase',
      header: 'Phase',
      cell: ({ row }) => {
        const phase = row.getValue('phase') as string;
        const bgColor = getPhaseBg(phase);
        return (
          <Badge className={`rounded-md capitalize ${bgColor}`}>{phase}</Badge>
        );
      },
    },
    {
      accessorKey: 'isAutomated',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize text-muted-foreground">
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
          <Badge className={`rounded-md capitalize ${bgColor}`}>{status}</Badge>
        );
      },
    },
    // {
    //   accessorKey: 'completedBy',
    //   header: 'Completed By',
    //   cell: ({ row }) => {
    //     const completedBy = row.getValue('completedBy') as string;
    //     return <div className="flex gap-1">{completedBy || 'N/A'}</div>;
    //   },
    // },
    {
      accessorKey: 'completedAt',
      header: 'Completed At',
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <UpdateActivityStatusDialog
              activityDetail={row.original}
              loading={false}
              iconStyle="w-4 h-4"
            />
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() => handleEyeClick(row.original.id)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
