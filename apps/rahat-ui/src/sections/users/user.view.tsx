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
import UsersTable from './user.list';
import { usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useUserTableColumns } from './useUsersColumns';
import { useUserList, useUserStore } from '@rumsan/react-query';
import CoreBtnComponent from '../../components/core.btn';
import { UserCog } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserView() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const loggedUserRoles = React.useMemo(() => user?.data?.roles, [user]);
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const columns = useUserTableColumns();
  const { data: users, isSuccess, isLoading } = useUserList(pagination);

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
      <div className="p-4">
        <div className="flex justify-between items-center space-x-8 mb-4">
          <div>
            <h1 className="font-semibold text-[28px]">Users</h1>
            <p className="text-muted-foreground text-base">
              Here is the list of all the users
            </p>
          </div>
          {(loggedUserRoles?.includes('Admin') ||
            loggedUserRoles?.includes('Manager')) && (
            <CoreBtnComponent
              className="hover:text-primary text-white"
              Icon={UserCog}
              name="Manage Roles"
              handleClick={() => router.push('/users/roles')}
            />
          )}
        </div>
        <UsersTable loading={isLoading} table={table} />
      </div>
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
