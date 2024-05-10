'use client';
import { useState } from 'react';

import { useCommunityGroupList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '../../utils/debounceHooks';
import GroupList from './list.group';
import { useCommunityGroupTableColumns } from './useGroupColumns';

function ViewGroup() {
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

  const debouncedFilters = useDebounce(filters, 500) as any;
  debouncedFilters.autoCreated = true;
  const { data } = useCommunityGroupList({
    ...pagination,
    ...(debouncedFilters as any),
  });
  const columns = useCommunityGroupTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
    getRowId: (row) => row.uuid,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <Tabs defaultValue="groupList" className="h-full">
      <>
        <TabsContent value="groupList">
          <GroupList
            table={table}
            setFilters={setFilters}
            filters={filters}
            pagination={pagination}
            setPagination={setPagination}
          />
          <CustomPagination
            meta={data?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={data?.response?.meta.total || 0}
          />
        </TabsContent>
      </>
    </Tabs>
  );
}

export default ViewGroup;
