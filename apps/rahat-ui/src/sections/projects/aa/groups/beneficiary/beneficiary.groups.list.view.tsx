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
import {
  usePagination,
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import BeneficiaryGroupsTable from './beneficiary.groups.table';
import useBeneficiaryGroupsTableColumn from './useBeneficiaryGroupsTableColumn';
import CustomPagination from '../../../../../components/customPagination';
import { UUID } from 'crypto';

export default function StakeholdersGroupsListView() {
  const { id } = useParams();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  useStakeholdersGroups(id as UUID, { ...pagination });

  const { stakeholdersGroups, stakeholdersGroupsMeta } =
    useStakeholdersGroupsStore((state) => ({
      stakeholdersGroups: state.stakeholdersGroups,
      stakeholdersGroupsMeta: state.stakeholdersGroupsMeta,
    }));

  const columns = useBeneficiaryGroupsTableColumn();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    manualPagination: true,
    data: stakeholdersGroups ?? [],
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

  return (
    <div className="rounded border bg-card">
      <BeneficiaryGroupsTable table={table} />
      <CustomPagination
        meta={
          stakeholdersGroupsMeta || {
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
        total={stakeholdersGroupsMeta?.lastPage || 0}
      />
    </div>
  );
}
