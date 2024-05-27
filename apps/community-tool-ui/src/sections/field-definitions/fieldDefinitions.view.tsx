'use client';
import { useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useFieldDefinitionsList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import FieldDefinitionsListView from '../../sections/field-definitions/listView';
import { useFieldDefinitionsTableColumns } from './useFieldDefinitionsColumns';

export default function FieldDefinitionsView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
  } = usePagination();

  const { data } = useFieldDefinitionsList({
    ...pagination,
    ...(filters as any),
  });

  const columns = useFieldDefinitionsTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => String(row.id),
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <>
      <FieldDefinitionsListView
        table={table}
        setFilters={setFilters}
        filters={filters}
      />

      <CustomPagination
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={data?.response?.meta.total || 0}
      />
    </>
  );
}
