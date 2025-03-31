'use client';

import * as React from 'react';
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
  useVendorList,
  usePagination,
  useAssignVendorToProject,
} from '@rahat-ui/query';
import { useBoolean } from '../../hooks/use-boolean';
import { UUID } from 'crypto';
import { useTableColumns } from './useTableColumns';
import VendorsTable from './vendors.list.table';
import CustomPagination from '../../components/customPagination';

function VendorsView() {
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();

  const projectModal = useBoolean();
  const [refetch, setRefetch] = React.useState(false);

  const addVendor = useAssignVendorToProject();
  const { data: vendorData } = useVendorList(pagination, refetch);
  const [selectedProject, setSelectedProject] = React.useState<UUID>();
  const [selectedRow, setSelectedRow] = React.useState(null) as any;

  const handleAssignModalClick = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };

  console.log('vendorData', vendorData);
  console.log(refetch);

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');
    const res = await addVendor.mutateAsync({
      vendorUUID: selectedRow?.id,
      projectUUID: selectedProject,
    });
    projectModal.onFalse();
    setRefetch(!refetch);
  };
  const columns = useTableColumns(handleAssignModalClick);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: vendorData?.data || [],
    manualPagination: true,
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
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl text-label">Vendors</h1>
          <p className="text-sub-label">Here is the list of all the vendors</p>
        </div>
        <VendorsTable
          table={table}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          handleAssignProject={handleAssignProject}
          projectModal={projectModal}
          selectedRow={selectedRow}
        />
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePageSizeChange={setPerPage}
        handlePrevPage={setPrevPage}
        meta={vendorData?.response?.meta || {}}
        perPage={pagination.perPage}
      />
    </>
  );
}

export default React.memo(VendorsView);
