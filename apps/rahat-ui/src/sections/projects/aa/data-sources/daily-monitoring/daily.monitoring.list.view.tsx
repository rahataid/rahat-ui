import { useParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useDailyMonitoring, usePagination } from '@rahat-ui/query';
import DailyMonitoringTable from './daily.monitoring.table';
import useDailyMonitoringTableColumn from './useDailyMonitoringTableColumn';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import DailyMonitoringTableFilters from './daily.monitoring.table.filters';
import AddButton from '../../../components/add.btn';
import { UUID } from 'crypto';

export default function DailyMonitoringListView() {
  const params = useParams();
  const projectId = params.id as UUID;
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const columns = useDailyMonitoringTableColumn();

  const { data: MonitoringData } = useDailyMonitoring(projectId, {});

  const table = useReactTable({
    manualPagination: true,
    data: MonitoringData?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = () => {};
  const handleFilter = () => {};
  return (
    <div className="p-1 bg-secondary">
      <div className="flex gap-2 items-center mb-2">
        <DailyMonitoringTableFilters
          handleSearch={handleSearch}
          handleFilter={handleFilter}
        />
        <AddButton
          name=""
          path={`/projects/aa/${projectId}/data-sources/bulletin/add`}
        />
      </div>
      <div className="border bg-card rounded">
        <DailyMonitoringTable table={table} />
        <CustomPagination
          meta={{
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
        />
      </div>
    </div>
  );
}
