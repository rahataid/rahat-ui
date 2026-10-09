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
import { useGetUserStats, usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { GenderStats } from 'apps/rahat-ui/src/common';
import { useUserTableColumns } from './useUsersColumns';
import { useUserList, useUserStore } from '@rumsan/react-query';
import CoreBtnComponent from '../../components/core.btn';
import { BarChart3, List, UserCog, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ReusableTabs } from '../../components/reusable-tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';

export default function UserView() {
  const t = useTranslations('USERS_LIST');
  const g = useTranslations('GLOBAL');
  const router = useRouter();
  const { activeTab, setActiveTab } = useActiveTab('list');
  const user = useUserStore((state) => state.user);
  const loggedUserRoles = React.useMemo(() => user?.data?.roles, [user]);
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const columns = useUserTableColumns();
  const { data: users, isSuccess } = useUserList(pagination);
  const { data: userStats, isPending: isUserStatsPending } = useGetUserStats();
  const genderCounts: Record<string, number> =
    userStats?.data?.data?.genderStats ?? {};
  const totalUserCount = userStats?.data?.data?.totalCounts ?? 0;

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

  const tabItems = [
    {
      value: 'list',
      label: g('LIST'),
      icon: <List size={14} />,
      content: (
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
      ),
    },
    {
      value: 'stats',
      label: g('STATS'),
      icon: <BarChart3 size={14} />,
      content: (
        <GenderStats
          totalLabel={g('TOTAL_USERS')}
          distributionLabel={g('GENDER_DISTRIBUTION')}
          totalCount={totalUserCount}
          genderCounts={genderCounts}
          Icon={Users}
          isLoading={isUserStatsPending}
        />
      ),
    },
  ];

  return (
    <div className="pl-4 mt-2">
      <div className="flex justify-between items-center space-x-8">
        <div>
          <h1 className="font-semibold text-2xl text-label ">{t('USERS')}</h1>
        </div>
        {(loggedUserRoles?.includes('Admin') ||
          loggedUserRoles?.includes('Manager')) && (
          <CoreBtnComponent
            className="hover:text-primary"
            Icon={UserCog}
            name={t('MANAGE_ROLES')}
            handleClick={() => router.push('/users/roles')}
          />
        )}
      </div>
      <ReusableTabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        items={tabItems}
      />
    </div>
  );
}
