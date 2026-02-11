import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { TruncatedCell } from '../../../stakeholders/component/TruncatedCell';

// type DailyMonitoringRow = {
//   dataEntryBy?: string;
//   createdAt?: string;
//   riverBasin?: string;
//   groupKey: string;
// };

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
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('dataEntryBy')} maxLength={25} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      filterFn: (row, columnId, filterValue) => {
        const rowDate = new Date(row.getValue(columnId));
        const filterDate = new Date(filterValue);
        return rowDate.toDateString() === filterDate.toDateString();
      },
      cell: ({ row }) => (
        <TruncatedCell
          text={dateFormat(row.getValue('createdAt')) || 'N/A'}
          maxLength={30}
        />
      ),
    },

    {
      accessorKey: 'riverBasin',
      header: 'River Basin Demotable',
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('riverBasin')} maxLength={35} />
      ),
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
              onClick={() => handleEyeClick(row.original.groupKey)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
