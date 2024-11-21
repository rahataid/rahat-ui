import AddButton from '../projects/components/add.btn';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import DemoTable from '../../components/table';
import { useUsersRolesTableColumns } from './use.users.roles.table.columns';
import { User } from '@rumsan/sdk/types';
import { useUserRoleList } from '@rumsan/react-query';
import { UUID } from 'crypto';
import React from 'react';

type IProps = {
  userDetail: User;
};

export default function UsersRolesTabSplitView({ userDetail }: IProps) {
  const { data: roleList, isLoading } = useUserRoleList(
    userDetail?.uuid as UUID,
  );
  const updatedRoleList = React.useMemo(() => {
    return roleList?.data?.map((role) => ({
      ...role,
      userUUID: userDetail?.uuid as UUID,
    }));
  }, [roleList?.data, userDetail?.uuid]);

  const columns = useUsersRolesTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: updatedRoleList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-medium">User Roles</h1>
        <AddButton
          variant="ghost"
          className="text-primary"
          name="Role"
          path=""
        />
      </div>
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-400px)]"
        loading={isLoading}
      />
    </div>
  );
}
