import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';

export default function useVoiceLogsTableColumns() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Communication Title',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-24 hover:cursor-pointer">
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
      accessorKey: 'groupName',
      header: 'Group Name',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-24 hover:cursor-pointer">
                {row.getValue('groupName')}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row.getValue('groupName')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'group_type',
      header: 'Group Type',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-24 hover:cursor-pointer">
                {row.getValue('group_type')}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row.getValue('group_type')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: 'media_url',
      header: 'Message',
      cell: ({ row }) => {
        return (
          <div className="w-auto lg:w-[150px] h-[40px]">
            <audio
              src={row.getValue('media_url')}
              controls
              className="rounded-[56px] w-full h-full z-auto"
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 gap-2">
                {new Date(row.original.timestamp).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>
                {new Date(row.original.timestamp).toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'long',
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
              size={18}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/communication-logs/commsdetails/${row.original.communicationId}@${row.original.uuid}@${row.original.sessionId}?tab=individualLog&subTab=voice`,
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
