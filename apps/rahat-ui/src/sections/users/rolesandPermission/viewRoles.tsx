'use client';

import { useTranslations } from 'next-intl';
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
  const tAdd = useTranslations('GLOBAL');
  const tGlobal = useTranslations('GLOBAL');
  const t = useTranslations('USERS_ROLES_PERMISSIONS');
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
        title={t('ROLES_AND_PERMISSIONS')}
        subtitle={t('HERE_IS_A_LIST_OF_ALL')}
        path="/users"
      />
      <div className="rounded border bg-card p-4">
        <div className="mb-2 flex justify-between items-start space-x-2">
          <SearchInput
            className="w-full"
            name={tGlobal('ROLE')}
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onSearch={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
          />
          <AddButton name={tAdd('ROLE')} path="/users/roles/add" />
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
