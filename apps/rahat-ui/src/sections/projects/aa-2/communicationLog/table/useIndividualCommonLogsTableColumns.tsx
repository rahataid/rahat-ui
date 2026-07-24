import { useTranslations } from 'next-intl';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { getSessionColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

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
  const t = useTranslations('AA Project');
  const { id } = useParams();
  const router = useRouter();
  const formatDate = useDateFormat();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const columns: ColumnDef<IndividualCommonLogRow>[] = [
    {
      accessorKey: 'title',
      header: t('COMMUNICATION_TITLE'),
      cell: ({ row }: { row: CommonLogRow }) => (
        <TruncatedCell text={row.getValue('title')} />
      ),
    },
    {
      accessorKey: 'groupName',
      header: t('GROUP_NAME'),
      cell: ({ row }) => <TruncatedCell text={row.getValue('groupName')} />,
    },
    {
      accessorKey: 'group_type',
      header: t('GROUP_TYPE'),
      cell: ({ row }) => <TruncatedCell text={row.getValue('group_type')} />,
    },
    ...(type === 'voice'
      ? [
          {
            accessorKey: 'media_url',
            header: t('MESSAGE'),
            cell: ({ row }: { row: CommonLogRow }) => {
              return (
                <div className="relative w-auto lg:w-[150px] h-[40px] overflow-hidden">
                  <div className="w-full h-full overflow-hidden">
                    <audio
                      src={row.getValue('media_url')}
                      controls
                      className="rounded-[56px] w-full h-full"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
              );
            },
          },
        ]
      : [
          {
            accessorKey: 'message',
            header: t('MESSAGE'),
            cell: ({ row }: { row: CommonLogRow }) => (
              <TruncatedCell text={row.getValue('message')} />
            ),
          },
        ]),

    {
      accessorKey: 'timestamp',
      header: t('TIMESTAMP'),
      cell: ({ row }) => {
        const timestamp = formatDate(row.original.timestamp);
        return <TruncatedCell text={timestamp} maxLength={25} />;
      },
    },
    {
      accessorKey: 'sessionStatus',
      header: t('STATUS'),
      cell: ({ row }) => {
        const status = row.getValue('sessionStatus') as string;
        const className = getSessionColor(status as string);

        return <Badge className={className}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: t('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <TooltipComponent
              Icon={Eye}
              tip={t('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${id}/communication-logs/commsdetails/${row.original.communicationId}@${row.original.uuid}@${row.original.sessionId}?tab=individualLog&subTab=${type}`,
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
