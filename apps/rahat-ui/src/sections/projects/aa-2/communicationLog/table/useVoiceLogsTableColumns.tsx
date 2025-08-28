import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

function getStatusBg(status: string) {
  if (status === 'Not Started') {
    return 'bg-gray-200 text-black';
  }

  if (status === 'Work in Progress') {
    return 'bg-orange-200 text-yellow-600';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200 text-green-500';
  }

  return 'bg-red-200 text-red-600';
}

export default function useVoiceLogsTableColumns() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'communication_title',
      header: 'Communication Title',
      cell: ({ row }) => (
        <div className="truncate w-48 hover:cursor-pointer">
          {row.getValue('communication_title')}
        </div>
      ),
    },
    {
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => (
        <div className="truncate w-48 hover:cursor-pointer">
          {row.getValue('groupName')}
        </div>
      ),
    },
    {
      accessorKey: 'group_type',
      header: 'Group Type',
      cell: ({ row }) => (
        <div className="truncate w-48 hover:cursor-pointer">
          {row.getValue('group_type')}
        </div>
      ),
    },
    {
      accessorKey: 'media_url',
      header: 'Message',
      cell: ({ row }) => {
        return (
          <div className="relative w-[249px] h-[32px]">
            <audio
              src={row.getValue('media_url')}
              controls
              className="w-full h-full p-[6px_16px] rounded-[56px]"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'timestamp',
      header: () => (
        <div className="flex items-center space-x-2">
          <span>Timestamp</span>
          {/* <ArrowUpDown className="cursor-pointer" /> */}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 gap-2">
          {new Date(row.original.timestamp).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>
      ),
    },
    {
      accessorKey: 'sessionStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('sessionStatus') as string;
        const className = getStatusBg(status as string);

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
                  `/projects/aa/${id}/communication-logs/voicedetails/${row.original.communicationId}@${row.original.sessionId}`,
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
