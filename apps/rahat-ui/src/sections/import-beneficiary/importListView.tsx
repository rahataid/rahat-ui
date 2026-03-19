'use client';
import { useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useListImports, usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import ImportListTable from './importListTable';
import { useImportListTableColumns } from './useImportColumns';
import HeaderWithBack from '../projects/components/header.with.back';

function ImportListView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();

  const { data: imports, isLoading } = useListImports({
    ...pagination,
    ...(filters as any),
  });

  const columns = useImportListTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: imports?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row?.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <div className="p-4 flex flex-col h-[calc(100vh-65px)]">
      <HeaderWithBack
        title="Import Beneficiary"
        subtitle="Here are the beneficiary imports listed from the imports API"
        path="/beneficiary"
      />
      <div className="p-4 border rounded-sm flex-1 overflow-hidden">
        <ImportListTable
          table={table}
          setFilters={setFilters}
          filters={filters}
          pagination={pagination}
          setPagination={setPagination}
          loading={isLoading}
        />
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={imports?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={imports?.response?.meta?.total || 0}
      />
    </div>
  );
}

export default ImportListView;
