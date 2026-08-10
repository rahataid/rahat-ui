import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { setPaginationToLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useProjectInfo } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';
import { useTranslations } from 'next-intl';

type DailyMonitoringRow = {
  dataEntryBy?: string;
  createdAt?: string;
  riverBasin?: string;
  groupKey: string;
};

export default function useDailyMonitoringTableColumn() {
  const t = useTranslations('AA_PROJECT');
  const formatDate = useDateFormat();
  const { id: projectId } = useParams();
  const router = useRouter();
  const { data: projectInfo } = useProjectInfo(projectId as UUID);

  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
    t,
  );
  const handleEyeClick = (id: string) => {
    setPaginationToLocalStorage();
    router.push(
      `/projects/aa/${projectId}/data-sources/daily-monitoring/${id}`,
    );
  };

  const columns: ColumnDef<DailyMonitoringRow>[] = [
    {
      accessorKey: 'dataEntryBy',
      header: t('CREATED_BY'),
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('dataEntryBy')} maxLength={25} />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('CREATED_AT'),
      filterFn: (row, columnId, filterValue) => {
        const rowDate = new Date(row.getValue(columnId));
        const filterDate = new Date(filterValue);
        return rowDate.toDateString() === filterDate.toDateString();
      },
      cell: ({ row }) => (
        <TruncatedCell
          text={formatDate(row.getValue('createdAt')) || 'N/A'}
          maxLength={30}
        />
      ),
    },

    {
      accessorKey: 'riverBasin',
      header: stationHeading,
      cell: ({ row }) => (
        <TruncatedCell text={row.getValue('riverBasin')} maxLength={35} />
      ),
    },
    {
      id: 'actions',
      header: t('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex gap-4 items-center">
            <TooltipComponent
              Icon={Eye}
              tip={t('VIEW_DETAILS')}
              iconStyle="cursor-pointer hover:text-primary"
              handleOnClick={() => handleEyeClick(row.original.groupKey)}
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
