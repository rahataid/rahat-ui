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
  useBeneficiariesGroups,
  useBeneficiariesGroupStore,
} from '@rahat-ui/query';
import BeneficiaryGroupsTable from './beneficiary.groups.table';
import useBeneficiaryGroupsTableColumn from './useBeneficiaryGroupsTableColumn';
import CustomPagination from '../../../../../components/customPagination';
import { UUID } from 'crypto';

export default function BeneficiariesGroupsListView() {
  const { id } = useParams();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  useBeneficiariesGroups(id as UUID, { ...pagination });

  const { beneficiariesGroups, beneficiariesGroupsMeta } =
    useBeneficiariesGroupStore((state) => ({
      beneficiariesGroups: state.beneficiariesGroups,
      beneficiariesGroupsMeta: state.beneficiariesGroupsMeta,
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
    data: beneficiariesGroups ?? [],
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
          beneficiariesGroupsMeta || {
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
        total={beneficiariesGroupsMeta?.lastPage || 0}
      />
    </div>
  );
}