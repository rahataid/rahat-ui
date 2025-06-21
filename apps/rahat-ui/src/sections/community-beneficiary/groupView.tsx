'use client';
import { useMemo, useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useListTempGroups, usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import GroupListView from './communitBeneficiaryGroupList';
import { useCommunityBeneficiaryGroupTableColumns } from './useCommunityBeneficiaryColumn';
import { ChevronLeftIcon } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useRouter, useSearchParams } from 'next/navigation';

function ViewCommunityGroup() {
  const router = useRouter();

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();

  const { data: tempGroups, isLoading } = useListTempGroups({
    ...pagination,
    ...(filters as any),
  });

  const columns = useCommunityBeneficiaryGroupTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: tempGroups?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row?.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <div className="p-4">
      <HeaderWithBack
        title="Import Group from Community Tool"
        subtitle=" Here beneficiary groups from the Community Tool are listed and
          available for import"
        path="/beneficiary"
      />
      <div className="p-4  border rounded-sm ">
        <GroupListView
          table={table}
          setFilters={setFilters}
          filters={filters}
          pagination={pagination}
          setPagination={setPagination}
          loading={isLoading}
        />
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={tempGroups?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={tempGroups?.response?.meta?.total || 0}
      />
    </div>
  );
}

export default ViewCommunityGroup;
