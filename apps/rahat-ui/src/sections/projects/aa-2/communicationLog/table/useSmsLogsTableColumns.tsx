import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ArrowUpDown, Eye } from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';

export default function useSmsLogsTableColumns() {
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
              <div className="truncate w-28 hover:cursor-pointer">
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
              <div className="truncate w-28 hover:cursor-pointer">
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
              <div className="truncate w-28 hover:cursor-pointer">
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
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-28 hover:cursor-pointer">
                {row.getValue('message')}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row.getValue('message')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
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
              className="w-80 rounded-sm text-justify"
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
              size={20}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/communication-logs/commsdetails/${row.original.communicationId}@${row.original.uuid}@${row.original.sessionId}?tab=individualLog&subTab=sms`,
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
