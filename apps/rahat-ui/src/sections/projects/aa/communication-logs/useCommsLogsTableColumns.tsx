import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

export default function useCommsLogsTableColumns() {
  const t = useTranslations('AA Project');
  const formatDate = useDateFormat();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'audience',
      header: t('AUDIENCE'),
      cell: ({ row }) => <div className="">{row?.original?.address}</div>,
    },
    {
      accessorKey: 'status',
      header: t('STATUS'),
      cell: ({ row }) => {
        return (
          <Badge className={renderBadgeBg(row?.original?.status)}>
            {row?.original?.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'attempts',
      header: t('ATTEMPTS'),
      cell: ({ row }) => {
        return <div className="ml-8">{row?.original?.attempts}</div>;
      },
    },
    {
      accessorKey: 'timeStamp',
      header: t('TIMESTAMP'),
      cell: ({ row }) => <div>{formatDate(row?.original?.createdAt)}</div>,
    },
    {
      accessorKey: 'duration',
      header: t('DURATION'),
      cell: ({ row }) => (
        <div>{row?.original?.disposition?.cdr?.billableseconds || 'N/A'}</div>
      ),
    },
  ];
  return columns;
}

function renderBadgeBg(status: string) {
  if (status === BroadcastStatus.FAIL) {
    return 'bg-red-200';
  }
  if (status === BroadcastStatus.SUCCESS) {
    return 'bg-green-200';
  }
  if (status === BroadcastStatus.PENDING) {
    return 'bg-yellow-200';
  }
  return 'bg-gray-200';
}
