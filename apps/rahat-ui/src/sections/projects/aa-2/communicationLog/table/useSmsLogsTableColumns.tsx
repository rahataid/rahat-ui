import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Eye } from 'lucide-react';



export default function useSmsLogsTableColumns() {
  const columns: ColumnDef<any>[] = [

    {

      accessorKey: 'title',
      header: 'Communication Title',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-48 hover:cursor-pointer">
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
      accessorKey: 'groupType',
      header: 'Group Type',
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="truncate w-48 hover:cursor-pointer">
                {row.getValue('groupType')}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="w-80 rounded-sm text-justify "
            >
              <p>{row.getValue('groupType')}</p>
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
      header: 'Timestamp',
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const className =
          status === 'Completed'
            ? 'bg-green-100 text-green-800'
            : status === 'Failed'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800';
        return (
          <span className={`px-2 py-1 rounded ${className}`}>{status}</span>
        );
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
