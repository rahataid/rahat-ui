import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { IActivitiesItem } from 'apps/rahat-ui/src/types/activities';
import UpdateActivityStatusDialog from '../details/update.activity.status.dialog';
import { setPaginationToLocalStorage } from '../../prev.pagination.storage';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';

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
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id: projectID } = useParams();
  const router = useRouter();
  const formatDate = useDateFormat();

  const handleEyeClick = (activityId: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectID}/activities/${activityId}`);
  };

  const columns: ColumnDef<IActivitiesItem>[] = [
    {
      accessorKey: 'title',
      header: t('TITLE'),
      cell: ({ row }) => <div className="w-80">{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'category',
      header: t('CATEGORY'),
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize w-max text-muted-foreground">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'phase',
      header: t('PHASE'),
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
      header: tg('TYPE'),
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize text-muted-foreground">
          {row.getValue('isAutomated') ? t('AUTOMATED') : t('MANUAL')}
        </Badge>
      ),
    },
    {
      accessorKey: 'responsibility',
      header: t('RESPONSIBILITY'),
      cell: ({ row }) => <div>{row.getValue('responsibility')}</div>,
    },
    {
      accessorKey: 'source',
      header: t('RESPONSIBLE_STATION'),
      cell: ({ row }) => <div>{row.getValue('source')}</div>,
    },
    {
      accessorKey: 'status',
      header: tg('STATUS'),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const bgColor = getStatusBg(status);
        return (
          <Badge className={`rounded-md capitalize ${bgColor}`}>{status}</Badge>
        );
      },
    },
    {
      accessorKey: 'completedBy',
      header: t('COMPLETED_BY'),
      cell: ({ row }) => {
        const completedBy = row.getValue('completedBy') as string;
        return <div className="flex gap-1">{completedBy || t('NA')}</div>;
      },
    },
    {
      accessorKey: 'completedAt',
      header: t('COMPLETED_AT'),
      cell: ({ row }) => {
        const completedAt = row.getValue('completedAt') as string;
        if (completedAt) {
          return formatDate(completedAt);
        }
        return t('NA');
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
