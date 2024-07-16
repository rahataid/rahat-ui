import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { IActivitiesItem } from '../../../../types/activities';

function getPhaseBg(phase: string) {
  if (phase === 'PREPAREDNESS') {
    return 'bg-yellow-200';
  }

  if (phase === 'READINESS') {
    return 'bg-green-200';
  }

  if (phase === 'ACTIVATION') {
    return 'bg-red-200';
  }

  return '';
}

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

export default function useActivitiesTableColumn() {
  const { id: projectID } = useParams();
  const router = useRouter();

  const columns: ColumnDef<IActivitiesItem>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize w-max text-muted-foreground">
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'phase',
      header: 'Phase',
      cell: ({ row }) => {
        const phase = row.getValue('phase') as string;
        const bgColor = getPhaseBg(phase);
        return (
          <Badge className={`rounded-md capitalize ${bgColor}`}>{phase}</Badge>
        );
      },
    },
    {
      accessorKey: 'isAutomated',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className="rounded-md capitalize text-muted-foreground">
          {row.getValue('isAutomated') ? 'Automated' : 'Manual'}
        </Badge>
      ),
    },
    {
      accessorKey: 'responsibility',
      header: 'Responsibility',
      cell: ({ row }) => <div>{row.getValue('responsibility')}</div>,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <div>{row.getValue('source')}</div>,
    },
    // {
    //   accessorKey: 'hazardType',
    //   header: () => <div className="w-max">Hazard Type</div>,
    //   cell: ({ row }) => <div>{row.getValue('hazardType')}</div>,
    // },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const bgColor = getStatusBg(status);
        return (
          <div className="flex gap-1">
            <Badge className={`rounded-md capitalize ${bgColor}`}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'completedBy',
      header: 'Completed By',
      cell: ({ row }) => {
        const completedBy = row.getValue('completedBy') as string
        return (
          <div className="flex gap-1">
            {completedBy || 'N/A'}
          </div>
        )
      } ,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);
        return (
          <Eye
            className="hover:text-primary cursor-pointer"
            size={20}
            strokeWidth={1.5}
            onClick={() =>
              router.push(
                `/projects/aa/${projectID}/activities/${row.original.id}`,
              )
            }
          />
        );
      },
    },
  ];

  return columns;
}
