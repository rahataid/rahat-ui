import { useTranslations } from 'next-intl';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { getSessionColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

interface IndividualCommonLogRow {
  title?: string;
  groupName?: string;
  group_type?: string;
  media_url?: string;
  message?: string;
  timestamp: string | number | Date;
  sessionStatus?: string;
  communicationId: string;
  uuid: string;
  sessionId: string;
}

type CommonLogRow = Row<IndividualCommonLogRow>;

export default function useIndividualCommonLogsTableColumns(
  type: 'sms' | 'email' | 'voice',
) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const router = useRouter();
  const formatDate = useDateFormat();
  const columns: ColumnDef<IndividualCommonLogRow>[] = [
    {
      accessorKey: 'title',
      header: t('COMMUNICATION_TITLE'),
      cell: ({ row }: { row: CommonLogRow }) => (
        <TruncatedCell text={row.getValue('title')} truncateByWidth />
      ),
    },
    {
      accessorKey: 'groupName',
      header: t('GROUP_NAME'),
      meta: { className: 'w-[140px] min-w-[120px]' },
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('groupName')} truncateByWidth />
      ),
    },
    {
      accessorKey: 'group_type',
      header: t('GROUP_TYPE'),
      meta: { className: 'w-[140px] min-w-[120px]' },
      cell: ({ row }) => <TruncatedCell text={row.getValue('group_type')} />,
    },
    ...(type === 'voice'
      ? [
          {
            accessorKey: 'media_url',
            header: t('MESSAGE'),
            meta: { className: 'w-[230px] min-w-[210px]' },
            cell: ({ row }: { row: CommonLogRow }) => {
              const mediaUrl = row.getValue('media_url') as string;
              if (!mediaUrl) {
                return (
                  <span className="text-xs text-muted-foreground italic">
                    {tg('N_A')}
                  </span>
                );
              }
              return (
                <div className="w-[210px] h-8 flex items-center">
                  <audio
                    src={mediaUrl}
                    controls
                    className="w-full h-8"
                    preload="metadata"
                  />
                </div>
              );
            },
          },
        ]
      : [
          {
            accessorKey: 'message',
            header: t('MESSAGE'),
            meta: { className: 'w-[200px] min-w-[160px]' },
            cell: ({ row }: { row: CommonLogRow }) => (
              <TruncatedCell text={row.getValue('message')} truncateByWidth />
            ),
          },
        ]),

    {
      accessorKey: 'timestamp',
      header: t('TIMESTAMP'),
      meta: { className: 'w-[180px] min-w-[160px]' },
      cell: ({ row }) => {
        const timestamp = formatDate(row.original.timestamp);
        return <TruncatedCell text={timestamp} truncateByWidth />;
      },
    },
    {
      accessorKey: 'sessionStatus',
      header: t('STATUS'),
      meta: { className: 'w-[110px] min-w-[100px]' },
      cell: ({ row }) => {
        const status = row.getValue('sessionStatus') as string;
        const className = getSessionColor(status as string);

        return (
          <Badge className={className}>
            {translateValue(tg, status, { fallbackStyle: 'raw' })}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: t('ACTIONS'),
      enableHiding: false,
      meta: { className: 'w-[70px]' },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <TooltipComponent
              Icon={Eye}
              tip={t('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${id}/communication-logs/commsdetails/${row.original.communicationId}@${row.original.uuid}@${row.original.sessionId || ''}?tab=individualLog&subTab=${type}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
