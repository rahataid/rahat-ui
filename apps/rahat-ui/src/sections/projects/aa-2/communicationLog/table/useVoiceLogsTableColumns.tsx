import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export default function useVoiceLogsTableColumns() {
  const columns: ColumnDef<any>[] = [
   {
    accessorKey: 'title',
    header: 'Communication Title',
    cell: ({ row }) => (
      <div className="truncate w-48 hover:cursor-pointer">
        {row.getValue('title')}
      </div>
    ),
   }
    ,
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
      accessorKey: 'groupType',
      header: 'Group Type',
      cell: ({ row }) => (
        <div className="truncate w-48 hover:cursor-pointer">
          {row.getValue('groupType')}
        </div>
      ),
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <div className="truncate w-48 hover:cursor-pointer">
          <audio
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
            controls
            controlsList="nodownload noplaybackrate" 
            className="w-full h-12"
          />
        </div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 gap-2">
          {new Date(row.getValue('timestamp')).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue('status')}
        </div>
      ),
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
