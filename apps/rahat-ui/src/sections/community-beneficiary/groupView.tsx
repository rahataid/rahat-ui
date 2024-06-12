'use client';
import { useState } from 'react';

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

function ViewCommunityGroup() {
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

  const { data: tempGroups } = useListTempGroups({
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
    <Tabs defaultValue="list" className="h-full">
      <>
        <TabsContent value="list">
          <GroupListView
            table={table}
            setFilters={setFilters}
            filters={filters}
            pagination={pagination}
            setPagination={setPagination}
          />
        </TabsContent>

        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          meta={tempGroups?.response?.meta || { total: 0, currentPage: 0 }}
          perPage={pagination?.perPage}
          total={tempGroups?.response?.meta?.total || 0}
        />
      </>
    </Tabs>
  );
}

export default ViewCommunityGroup;
