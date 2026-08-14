import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { BroadcastStatus } from '@rumsan/connect/src/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { TriangleAlertIcon } from 'lucide-react';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
export default function useCommsLogsTableColumns(transportName: string) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const renderDateTime = (dateTime: string) => formatDate(dateTime);
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
        return <div className="ml-8">{formatNum(row?.original?.attempts ?? 0)}</div>;
      },
    },
    // hide duration column for EMAIL and SMS transports
    ...(transportName !== 'EMAIL' && transportName !== 'SMS'
      ? [
          {
            accessorKey: 'duration',
            header: t('DURATION'),
            cell: ({ row }) => (
              <div>
                {row?.original?.disposition?.cdr?.billableseconds != null ? formatNum(row?.original?.disposition?.cdr?.billableseconds) : 'N/A'}
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: 'timeStamp',
      header: t('TIMESTAMP'),
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2 gap-2">
            {formatDate(row?.original?.updatedAt)}
            {transportName === 'VOICE' && row?.original?.status === 'FAIL' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="hover:cursor-pointer py-0">
                    <TriangleAlertIcon
                      className="w-6 h-6 xl:w-4 xl:h-4  text-red-500"
                      strokeWidth={2.5}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="left"
                    className="w-96 rounded-sm p-4 max-h-60 overflow-auto"
                  >
                    <div className="flex space-x-2 items-center">
                      <TriangleAlertIcon
                        size={16}
                        strokeWidth={1.5}
                        color="red"
                      />
                      <span className="font-semibold text-sm/6">{t('FAIL')}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 break-words">
                      {row.original?.disposition?.disposition}
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
