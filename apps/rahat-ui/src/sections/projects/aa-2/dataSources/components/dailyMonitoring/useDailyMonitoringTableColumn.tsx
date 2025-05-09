import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';

export default function useDailyMonitoringTableColumn() {
  const { id: projectId } = useParams();
  const router = useRouter();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(
      `/projects/aa/${projectId}/data-sources/daily-monitoring/${id}`,
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        if (createdAt) {
          const d = new Date(createdAt);
          const localeDate = d.toLocaleDateString();
          const localeTime = d.toLocaleTimeString();
          return `${localeDate} ${localeTime}`;
        }
        return 'N/A';
      },
    },
    {
      accessorKey: 'dataEntryBy',
      header: 'Created By',
      cell: ({ row }) => {
        return row.getValue('dataEntryBy');
      },
    },
    {
      accessorKey: 'location',
      header: 'River Basin',
      cell: ({ row }) => {
        return row.getValue('location');
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
              className="cursor-pointer hover:text-primary"
              size={20}
              strokeWidth={1.5}
              onClick={() => handleEyeClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
