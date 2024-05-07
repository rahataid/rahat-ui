'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import TriggerStatementsTable from './trigger-statements.table';
import { useTriggerStatementTableColumns } from './useTriggerStatementsColumns';
import { useAATriggerStatements, usePagination } from '@rahat-ui/query';
import CustomPagination from '../../../../components/customPagination';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function TriggerStatementsView() {
  const { id } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const columns = useTriggerStatementTableColumns();
  const { data: tableData } = useAATriggerStatements(id as UUID);

  console.log(tableData);

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onRowSelectionChange: setRowSelection,
    // onColumnVisibilityChange: setColumnVisibility,
    // state: {
    // rowSelection,
    // columnVisibility,
    // },
  });
  return (
    <>
      <TriggerStatementsTable table={table} projectId={id} />
      <CustomPagination
        meta={{ total: 0, currentPage: 0, lastPage: 0, perPage: 0, next: null, prev: null }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
}
