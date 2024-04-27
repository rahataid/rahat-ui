'use client';
import { useCallback, useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import CustomPagination from '../../components/customPagination';
import { FIELD_DEFINITON_NAV_ROUTE } from '../../constants/fieldDefinition.const';
import FieldDefinitionsListView from '../../sections/field-definitions/listView';
import { useFieldDefinitionsList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
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

  const [selectedData, setSelectedData] = useState<FieldDefinition | null>();
  const [active, setActive] = useState<string>(
    FIELD_DEFINITON_NAV_ROUTE.DEFAULT,
  );

  const handleFieldDefClick = useCallback((item: FieldDefinition) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <>
      <FieldDefinitionsListView
        table={table}
        handleClick={handleFieldDefClick}
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
        total={data?.response?.meta.lastPage || 0}
      />
    </>
  );
}
