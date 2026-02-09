import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

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
      accessorKey: 'dataEntryBy',
      header: 'Created By',
      cell: ({ row }) => {
        return row.getValue('dataEntryBy');
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      filterFn: (row, columnId, filterValue) => {
        const rowDate = new Date(row.getValue(columnId));
        const filterDate = new Date(filterValue);
        return rowDate.toDateString() === filterDate.toDateString();
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        if (createdAt) {
          return dateFormat(createdAt);
        }
        return 'N/A';
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
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 items-center">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Eye
                    className="cursor-pointer hover:text-primary"
                    size={20}
                    strokeWidth={1.5}
                    onClick={() => handleEyeClick(row.original.groupKey)}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="top">
                  <p className="text-xs font-medium">View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return columns;
}
