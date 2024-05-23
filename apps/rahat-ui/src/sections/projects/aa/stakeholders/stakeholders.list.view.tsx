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
  useStakeholders,
  useStakeholdersStore,
  usePagination,
} from '@rahat-ui/query';
import StakeholdersTable from './stakeholders.table';
import useStakeholdersTableColumn from './useStakeholdersTableColumn';
import CustomPagination from '../../../../components/customPagination';
import { UUID } from 'crypto';
import StakeholdersTableFilters from './stakeholders.table.filters';

export default function StakeholdersList() {
  const { id: projectID } = useParams();
  const [stakeholderSearchText, setStakeholderSearchText] = React.useState('');
  const [organizationSearchText, setOrganizationSearchText] =
    React.useState('');
  const [municipalitySearchText, setMunicipalitySearchText] =
    React.useState('');

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

  useStakeholders(projectID as UUID, { ...pagination, ...filters });

  const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
    stakeholders: state.stakeholders,
    stakeholdersMeta: state.stakeholdersMeta,
  }));

  const columns = useStakeholdersTableColumn();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    manualPagination: true,
    data: stakeholders ?? [],
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

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({
        [key]: event.target.value,
      });
    },
    [filters],
  );

  React.useEffect(() => {
    setStakeholderSearchText(filters?.name ?? '');
    setOrganizationSearchText(filters?.organization ?? '');
    setMunicipalitySearchText(filters?.municipality ?? '');
  }, [filters]);

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-65px)]">
      <StakeholdersTableFilters
        projectID={projectID as UUID}
        handleSearch={handleSearch}
        stakeholder={stakeholderSearchText}
        organization={organizationSearchText}
        municipality={municipalitySearchText}
      />
      <div className="border bg-card rounded">
        <StakeholdersTable
          table={table}
          tableScrollAreaHeight="h-[calc(100vh-179px)]"
        />
        <CustomPagination
          meta={
            stakeholdersMeta || {
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
          total={stakeholdersMeta?.lastPage || 0}
        />
      </div>
    </div>
  );
}
