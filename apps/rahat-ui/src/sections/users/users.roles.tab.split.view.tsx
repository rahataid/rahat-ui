import React from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import DemoTable from '../../components/table';
import { useUsersRolesTableColumns } from './use.users.roles.table.columns';
import { User } from '@rumsan/sdk/types';
import { useUserRoleList, useUserStore } from '@rumsan/react-query';
import { UUID } from 'crypto';
import AssignRoleDialog from './assign.role.dialog';

type IProps = {
  userDetail: User;
};

export default function UsersRolesTabSplitView({ userDetail }: IProps) {
  const user = useUserStore((state) => state.user);
  const loggedUserRoles = React.useMemo(() => user?.data?.roles, [user]);

  const { data: roleList, isLoading } = useUserRoleList(
    userDetail?.uuid as UUID,
  );

  const columns = useUsersRolesTableColumns({
    loggedUserRoles,
    userUUID: userDetail?.uuid as UUID,
  });
  const table = useReactTable({
    manualPagination: true,
    data: roleList?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-medium">User Roles</h1>
        {(loggedUserRoles?.includes('Admin') ||
          loggedUserRoles?.includes('Manager')) && (
          <AssignRoleDialog userUUID={userDetail?.uuid as UUID} />
        )}
      </div>
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-400px)]"
        loading={isLoading}
      />
    </div>
  );
}
