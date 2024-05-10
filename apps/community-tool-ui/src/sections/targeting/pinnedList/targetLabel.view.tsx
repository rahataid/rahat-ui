'use client';
import { useCallback, useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import CustomPagination from '../../../components/customPagination';
import TargetLabelListView from './listView';
import { useTargetingList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { useTargetLabelTableColumns } from './useTargetLabelColumns';
import { useDebounce } from 'apps/community-tool-ui/src/utils/debounceHooks';

export default function TargetLabelView() {
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

  const debouncedFilters = useDebounce(filters, 500) as any;

  const { data } = useTargetingList({
    ...pagination,
    ...(debouncedFilters as any),
  });

  const columns = useTargetLabelTableColumns();
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
    getRowId: (row) => String(row.uuid),
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <>
      <TargetLabelListView
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
