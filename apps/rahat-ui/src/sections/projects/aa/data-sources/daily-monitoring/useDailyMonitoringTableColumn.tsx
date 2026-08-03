import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { setPaginationToLocalStorage } from '../../prev.pagination.storage';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

export default function useDailyMonitoringTableColumn() {
  const { id: projectId } = useParams();
  const router = useRouter();
  const formatDate = useDateFormat();
  const tg = useTranslations('GLOBAL');
  const t = useTranslations('AA_PROJECT');

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(
      `/projects/aa/${projectId}/data-sources/daily-monitoring/${id}`,
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdAt',
      header: t('CREATED_AT'),
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        if (createdAt) {
          return formatDate(createdAt);
        }
        return t('N_A');
      },
    },
    {
      accessorKey: 'dataEntryBy',
      header: t('CREATED_BY'),
      cell: ({ row }) => {
        return row.getValue('dataEntryBy');
      },
    },
    {
      accessorKey: 'location',
      header: t('RIVER_BASIN'),
      cell: ({ row }) => {
        return row.getValue('location');
      },
    },
    {
      id: 'actions',
      header: t('ACTIONS'),
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
