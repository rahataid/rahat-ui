import React from 'react';
import { FundManagementTable } from './fundManagement.table';
import { useGroupsReservedFunds, usePagination } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
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

const FundManagementView = () => {
  const { id: projectID } = useParams();
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
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const fundManagementColumns = useFundManagementColumns();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const { data: groupsFundsData, isLoading } = useGroupsReservedFunds(
    projectID as UUID,
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
      <div className="border bg-card rounded">
        <FundManagementTable table={table} />
      </div>
      <div className="border bg-card rounded">
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
