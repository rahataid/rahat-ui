import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ArrowUpDown, Eye } from 'lucide-react';
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

export default function useSmsLogsTableColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'communication_title',
      header: 'Communication Title',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-48 hover:cursor-pointer">
                {row.getValue('communication_title')}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row.getValue('communication_title')}</p>
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
              <div className="truncate w-48 hover:cursor-pointer">
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
              <div className="truncate w-48 hover:cursor-pointer">
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
              <div className="truncate w-48 hover:cursor-pointer">
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
        <div className="capitalize min-w-32">
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
              // onClick={() =>
              //   router.push(
              //     `/projects/aa/${id}/communication-logs/details/${row.original.id}`,
              //   )
              // }
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
