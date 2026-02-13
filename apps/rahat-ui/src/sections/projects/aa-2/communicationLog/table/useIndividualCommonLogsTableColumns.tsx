import { ColumnDef, Row } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { getSessionColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';

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
  const { id } = useParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const columns: ColumnDef<IndividualCommonLogRow>[] = [
    {
      accessorKey: 'title',
      header: 'Communication Title',
      cell: ({ row }: { row: CommonLogRow }) => (
        <TruncatedCell text={row.getValue('title')} maxLength={20} />
      ),
    },
    {
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('groupName')} maxLength={20} />
      ),
    },
    {
      accessorKey: 'group_type',
      header: 'Group Type',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('group_type')} maxLength={20} />
      ),
    },
    ...(type === 'voice'
      ? [
          {
            accessorKey: 'media_url',
            header: 'Message',
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
            header: 'Message',
            cell: ({ row }: { row: CommonLogRow }) => (
              <TruncatedCell text={row.getValue('message')} maxLength={20} />
            ),
          },
        ]),

    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <TruncatedCell
          text={new Date(row.original.timestamp).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
          maxLength={25}
        />
      ),
    },
    {
      accessorKey: 'sessionStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('sessionStatus') as string;
        const className = getSessionColor(status as string);

        return <Badge className={className}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={20}
              strokeWidth={1.5}
              onClick={() =>
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
