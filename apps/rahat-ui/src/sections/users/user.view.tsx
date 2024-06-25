'use client';

import * as React from 'react';
import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
// import { useUserStore } from '@rumsan/react-query';
import UsersTable from './user.list';
import { usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useUserTableColumns } from './useUsersColumns';
import { useUserList } from '@rumsan/react-query';

export default function UserView() {
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const columns = useUserTableColumns();
  // const users = useUserStore((state) => state.users);
  const { data: users, isSuccess } = useUserList(pagination);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const tableData = React.useMemo(() => {
    if (isSuccess) return users?.data;
    else return [];
  }, [isSuccess, users?.data]);

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      columnVisibility,
    },
  });

  return (
    <>
      <UsersTable table={table} />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={users?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination.perPage}
        total={users?.response?.meta?.lastPage || 0}
      />
    </>
  );
}
