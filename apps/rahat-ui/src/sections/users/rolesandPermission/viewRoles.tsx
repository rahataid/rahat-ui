'use client';

import { useRoleList } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRoleTableColumns } from './useRoleTableColumns';
import DemoTable from 'apps/rahat-ui/src/components/table';
import SearchInput from '../../projects/components/search.input';
import AddButton from '../../projects/components/add.btn';
import HeaderWithBack from '../../projects/components/header.with.back';

export default function RoleView() {
  const { data: rolesList, isLoading } = useRoleList();

  const columns = useRoleTableColumns();
  const table = useReactTable({
    data: rolesList?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Roles and Permissions"
        subtitle=" Here is a list of all the roles"
        path="/users"
      />
      <div className="rounded border bg-card p-4">
        <div className="mb-2 flex justify-between items-start space-x-2">
          <SearchInput
            className="w-full"
            name="role"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
          />
          <AddButton name="Role" path="/users/roles/add" />
        </div>
        <DemoTable
          table={table}
          tableHeight="h-[calc(100vh-256px)]"
          loading={isLoading}
        />
      </div>
    </div>
  );
}
