import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

function getStatusBg(status: string) {
  if (status === 'Not started') {
    return 'bg-red-200 text-red-600';
  }

  if (status === 'Work in Progress') {
    return 'bg-orange-200 text-yellow-600';
  }

  if (status === 'Completed') {
    return 'bg-green-200 text-green-500';
  }

  return 'bg-gray-200 text-black';
}

function getPhaseColor(phase: string) {
  if (phase === 'PREPAREDNESS') {
    return 'bg-green-200 text-green-500';
  }
  if (phase === 'ACTIVATION') {
    return 'bg-red-200 text-red-500';
  }
  if (phase === 'READINESS') {
    return 'bg-yellow-200 text-yellow-500';
  }
  return '';
}
export default function useCommsActivitiesTableColumns() {
  const router = useRouter();
  const { id } = useParams();

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
      cell: ({ row }) => {
        const phase = row.getValue('phase') as string;
        const className = getPhaseColor(phase);
        return <Badge className={className}>{phase}</Badge>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const className = getStatusBg(row.original?.commStatus);
        return <Badge className={className}>{row.original?.commStatus}</Badge>;
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
                  `/projects/aa/${id}/communication-logs/details/${row.original.id}`,
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
