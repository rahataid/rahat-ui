'use client';
import React, { useCallback, useState } from 'react';

import GroupList from './list.group';
import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import CustomPagination from '../../components/customPagination';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useCommunityGroupList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { useCommunityGroupTableColumns } from './useGroupColumns';
import { useDebounce } from '../../utils/debounceHooks';

function ViewGroup() {
  const [selectedData, setSelectedData] = useState<ListGroup>();
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

  const debouncedFilters = useDebounce(filters, 500);
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
  const handleGroup = useCallback((item: ListGroup) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <Tabs defaultValue="groupList" className="h-full">
      <>
        <TabsContent value="groupList">
          <GroupList
            table={table}
            handleClick={handleGroup}
            setFilters={setFilters}
            filters={filters}
            pagination={pagination}
            setPagination={setPagination}
          />
        </TabsContent>
        <CustomPagination
          meta={data?.response?.meta || { total: 0, currentPage: 0 }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={data?.response?.meta.lastPage || 0}
        />
      </>
    </Tabs>
  );
}

export default ViewGroup;
