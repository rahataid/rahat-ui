import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { formatdbDate } from 'apps/rahat-ui/src/utils';

export default function useDailyMonitoringTableColumn() {
  const { id: projectId } = useParams();
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div>{formatdbDate(row.original.createdAt)}</div>,
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => (
        <div>{new Date(row.original.createdAt).toLocaleTimeString()}</div>
      ),
    },
    {
      accessorKey: 'dataEntryBy',
      header: 'Data Entry By',
      cell: ({ row }) => <div>{row.original.data.name}</div>,
    },
    {
      accessorKey: 'location',
      header: 'River Basin',
      cell: ({ row }) => {
        return row.getValue('location');
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
      cell: ({ row }) => <div>{row.original.data.forecast}</div>,
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
              onClick={() =>
                router.push(
                  `/projects/aa/${projectId}/data-sources/bulletin/${row.original.uuid}`,
                )
              }
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
