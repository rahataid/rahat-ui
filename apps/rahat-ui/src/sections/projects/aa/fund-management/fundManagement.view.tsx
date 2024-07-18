import React from 'react';
import { FundManagementTable } from './fundManagement.table';
import { useGroupsReservedFunds, usePagination } from '@rahat-ui/query';
import { useParams, useSearchParams } from 'next/navigation';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { UUID } from 'crypto';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
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
import { useFundManagementColumns } from './useFundManagementColumns';
import TableFilter from './fm.table.filter';
import { getPaginationFromLocalStorage } from '../prev.pagination.storage';

const FundManagementView = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as UUID;
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

  const fundManagementColumns = useFundManagementColumns();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { data: groupsFundsData, isLoading } = useGroupsReservedFunds(
    projectId,
    {
      ...pagination,
      ...filters,
    },
  );

  const table = useReactTable({
    data: groupsFundsData?.response?.data || [],
    columns: fundManagementColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  if (isLoading) {
    return <TableLoader />;
  }

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <TableFilter table={table} projectId={projectId} />
      <div className="border bg-card rounded">
        <FundManagementTable table={table} />
        <CustomPagination
          meta={
            groupsFundsData?.response?.meta || {
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
          total={0}
        />
      </div>
    </div>
  );
};

export default FundManagementView;
