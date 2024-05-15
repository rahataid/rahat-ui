import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useActivities, useActivitiesCategories, useActivitiesHazardTypes, useActivitiesPhase, usePagination } from '@rahat-ui/query';
import useActivitiesTableColumn from './useActivitiesTableColumn';
import ActivitiesTable from './activities.table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { UUID } from 'crypto';
import ActivitiesTableFilters from './activities.table.filters';


export default function ActivitiesList() {
  const { id: projectID } = useParams();

  const {
    pagination,
    // selectedListItems,
    // setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);


  const { activitiesData, activitiesMeta, isLoading } = useActivities(projectID as UUID, { ...pagination, ...filters });

  useActivitiesCategories(projectID as UUID);
  useActivitiesHazardTypes(projectID as UUID);
  useActivitiesPhase(projectID as UUID);

  const columns = useActivitiesTableColumn();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    manualPagination: true,
    data: activitiesData ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleFilter = React.useCallback(
    (key: string, value: any) => {
      if (value === 'all') {
        setFilters({ ...filters, [key]: null })
        return
      }
      setFilters({ ...filters, [key]: value })
    },
    [filters, setFilters]
  )

  if (isLoading) {
    return <TableLoader />
  }
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <ActivitiesTableFilters
        projectID={projectID}
        handleFilter={handleFilter}
      />
      <div className='border bg-card rounded'>
        <ActivitiesTable table={table} />
        <CustomPagination
          meta={activitiesMeta || { total: 0, currentPage: 0, lastPage: 0, perPage: 0, next: null, prev: null }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={activitiesMeta?.lastPage || 0}
        />
      </div>
    </div>
  )
}
