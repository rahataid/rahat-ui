import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function useDailyMonitoringTableColumn() {
  const { id: projectId } = useParams();
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return row.getValue('date');
      },
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => {
        return row.getValue('time');
      },
    },
    {
      accessorKey: 'dataEntryBy',
      header: 'Data Entry By',
      cell: ({ row }) => {
        return row.getValue('dataEntryBy');
      },
    },
    {
      accessorKey: 'riverBasin',
      header: 'River Basin',
      cell: ({ row }) => {
        return row.getValue('riverBasin');
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        return row.getValue('source');
      },
    },
    {
      accessorKey: 'forecast',
      header: 'Forecast',
      cell: ({ row }) => {
        return row.getValue('forecast');
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 items-center">
            <Eye
              className="cursor-pointer"
              size={20}
              strokeWidth={1.5}
              // onClick={() =>
              //     router.push(
              //         `/projects/aa/${projectId}/activities/${row.original.id}`,
              //     )
              // }
            />
            <Pencil className="text-primary" size={20} strokeWidth={1.5} />
            <Trash2 className="text-red-500" size={20} strokeWidth={1.5} />
          </div>
        );
      },
    },
  ];

  return columns;
}
