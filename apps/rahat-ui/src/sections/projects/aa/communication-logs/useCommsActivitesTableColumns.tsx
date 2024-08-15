import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import ActivityCommsCards from './activity.comms.cards.list';

function getStatusBg(status: string) {
  if (status === 'NOT_STARTED') {
    return 'bg-gray-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-red-200';
  }

  return '';
}

export default function useCommsActivitiesTableColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="capitalize min-w-72">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div className="capitalize min-w-32">
          {new Date(row.getValue('createdAt')).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'phase',
      header: 'Phase',
      cell: ({ row }) => <div>{row.getValue('phase')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const bgColor = getStatusBg(status);
        return <Badge className={bgColor}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Eye
                className="hover:text-primary cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DialogTrigger>
            <DialogContent className='w-[500px]'>
              <DialogHeader>
                <DialogTitle className='mb-4'>Activity Details</DialogTitle>
                <ActivityCommsCards comms={row?.original?.activityCommunication} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];
  return columns;
}
