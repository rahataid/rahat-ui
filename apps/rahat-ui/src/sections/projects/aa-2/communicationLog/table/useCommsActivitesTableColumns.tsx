import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
function getStatusBg(status: string) {
  if (status === 'Not Started') {
    return 'bg-gray-200 text-black';
  }

  if (status === 'Work in Progress') {
    return 'bg-orange-200 text-yellow-600';
  }

  if (status === 'Completed') {
    return 'bg-green-200 text-green-500';
  }

  return 'bg-red-200 text-red-600';
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
        <TruncatedCell text={row.getValue('title')} truncateByWidth />
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Date',
      meta: { className: 'w-[20%]' },
      cell: ({ row }) => (
        <div className="capitalize min-w-32">
          <TruncatedCell
            text={dateFormat(row.original?.updatedAt)}
            truncateByWidth
          />
        </div>
      ),
    },
    {
      accessorKey: 'phase',
      header: 'Phase',
      meta: { className: 'w-[15%]' },
      cell: ({ row }) => {
        const phase = row.getValue('phase') as string;
        const className = getPhaseColor(phase);
        return (
          <Badge className={cn(className, 'max-w-full overflow-hidden')}>
            <TruncatedCell text={phase} truncateByWidth={true} />
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      meta: { className: 'w-[15%]' },
      cell: ({ row }) => {
        const className = getStatusBg(row.original?.commStatus);
        return <Badge className={className}>{row.original?.commStatus}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      meta: { className: 'w-[80px]' },
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <TooltipComponent
              Icon={Eye}
              tip="View Details"
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
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
