import * as React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  useActivities,
  useActivitiesCategories,
  useActivitiesPhase,
  usePagination,
} from '@rahat-ui/query';
import useActivitiesTableColumn from './useActivitiesTableColumn';
import ActivitiesTable from './activities.table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { UUID } from 'crypto';
import ActivitiesTableFilters from './activities.table.filters';
import { getPaginationFromLocalStorage } from '../../prev.pagination.storage';
import { generateExcel } from '../../generate.excel';
import { toast } from 'react-toastify';

export default function ActivitiesList() {
  const { id: projectID } = useParams();
  const searchParams = useSearchParams();
  const [activitySearchText, setActivitySearchText] =
    React.useState<string>('');
  const [responsibilitySearchText, setResponsibilitySearchText] =
    React.useState<string>('');
  const [phaseFilterItem, setPhaseFilterItem] = React.useState<string>('');
  const [categoryFilterItem, setCategoryFilterItem] =
    React.useState<string>('');
  const [statusFilterItem, setStatusFilterItem] = React.useState<string>('');

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  React.useEffect(() => {
    const isBackFromDetail = searchParams.get('backFromDetail') === 'true';
    const prevPagination = getPaginationFromLocalStorage(isBackFromDetail);
    setPagination(prevPagination);
  }, []);

  const { activitiesData, activitiesMeta, isLoading } = useActivities(
    projectID as UUID,
    { ...pagination, ...filters },
  );

  const { activitiesData: allData } = useActivities(projectID as UUID, {
    perPage: 9999,
  });

  useActivitiesCategories(projectID as UUID);
  useActivitiesPhase(projectID as UUID);

  const columns = useActivitiesTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: activitiesData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilter = React.useCallback(
    (key: string, value: any) => {
      if (value === 'all') {
        setFilters({ ...filters, [key]: null });
        return;
      }
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );

  React.useEffect(() => {
    setActivitySearchText(filters?.title ?? '');
    setResponsibilitySearchText(filters?.responsibility ?? '');
    setPhaseFilterItem(filters?.phase ?? '');
    setCategoryFilterItem(filters?.category ?? '');
    setStatusFilterItem(filters?.status ?? '');
  }, [filters]);

  const handleDownloadReport = () => {
    if (allData.length < 1) return toast.error('No data to download.');
    const mappedData = allData?.map((item: Record<string, any>) => {
      let timeStamp;
      if (item?.completedAt) {
        const d = new Date(item.completedAt);
        const localeDate = d.toLocaleDateString();
        const localeTime = d.toLocaleTimeString();
        timeStamp = `${localeDate} ${localeTime}`;
      }
      return {
        Title: item.title || 'N/A',
        'Early Action': item.category || 'N/A',
        Phase: item.phase || 'N/A',
        Type: item.isAutomated ? 'Automated' : 'Manual' || 'N/A',
        Responsibility: item.responsibility,
        'Responsible Station': item.source || 'N/A',
        Status: item.status || 'N/A',
        Timestamp: timeStamp || 'N/A',
        'Completed by': item.completedBy || 'N/A',
        'Difference in trigger and activity completion':
          item.timeDifference || 'N/A',
      };
    });

    generateExcel(mappedData, 'Activities_Report', 10);
  };

  if (isLoading) {
    return <TableLoader />;
  }
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <ActivitiesTableFilters
        projectID={projectID as UUID}
        handleFilter={handleFilter}
        handleSearch={handleSearch}
        handleDownload={handleDownloadReport}
        activity={activitySearchText}
        responsibility={responsibilitySearchText}
        phase={phaseFilterItem}
        category={categoryFilterItem}
        status={statusFilterItem}
      />
      <div className="border bg-card rounded overflow-y-auto">
        <ActivitiesTable table={table} />
        <CustomPagination
          meta={
            activitiesMeta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={activitiesMeta?.lastPage || 0}
        />
      </div>
    </div>
  );
}
