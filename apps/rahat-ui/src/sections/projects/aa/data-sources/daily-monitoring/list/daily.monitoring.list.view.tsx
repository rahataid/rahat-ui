import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useDailyMonitoring, usePagination } from '@rahat-ui/query';
import DailyMonitoringTable from './daily.monitoring.table';
import useDailyMonitoringTableColumn from '../useDailyMonitoringTableColumn';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import DailyMonitoringTableFilters from './daily.monitoring.table.filters';
import AddButton from '../../../../components/add.btn';
import { UUID } from 'crypto';
import { getPaginationFromLocalStorage } from '../../../usePrevPagination';

export default function DailyMonitoringListView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const searchParams = useSearchParams();
  const [userSearchText, setUserSearchText] = React.useState<string>('');
  const [locationFilterItem, setLocationFilterItem] =
    React.useState<string>('');
  const [dateFilterItem, setDateFilterItem] = React.useState<string>('');

  const {
    pagination,
    filters,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
  } = usePagination();

  React.useEffect(() => {
    const isBackFromDetail = searchParams.get('backFromDetail') === 'true';
    const prevPagination = getPaginationFromLocalStorage(isBackFromDetail);
    setPagination(prevPagination);
  }, []);
  const columns = useDailyMonitoringTableColumn();

  const { data: MonitoringData } = useDailyMonitoring(projectId, {
    ...pagination,
    ...filters,
  });

  const table = useReactTable({
    manualPagination: true,
    data: MonitoringData?.data ?? [],
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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, dataEntryBy: event.target.value });
    },
    [filters],
  );

  React.useEffect(() => {
    setLocationFilterItem(filters?.location ?? '');
    setUserSearchText(filters?.dataEntryBy ?? '');
    setDateFilterItem(filters?.createdAt ?? '');
  }, [filters]);
  return (
    <div className="p-1 bg-secondary">
      <div className="flex gap-2 items-center mb-2">
        <DailyMonitoringTableFilters
          user={userSearchText}
          location={locationFilterItem}
          date={dateFilterItem}
          handleSearch={handleSearch}
          handleFilter={handleFilter}
        />
        <AddButton
          name=""
          path={`/projects/aa/${projectId}/data-sources/daily-monitoring/add`}
        />
      </div>
      <div className="border bg-card rounded">
        <DailyMonitoringTable table={table} />
        <CustomPagination
          meta={
            MonitoringData?.meta || {
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
          total={MonitoringData?.meta?.lastPage || 0}
        />
      </div>
    </div>
  );
}
