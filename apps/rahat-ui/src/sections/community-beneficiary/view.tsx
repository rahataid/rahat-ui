'use client';
import { useEffect, useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  useBeneficiaryStore,
  useListTempBeneficiary,
  usePagination,
} from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '../../utils/useDebouncehooks';
import ListView from './list.view';
import { useCommunityBeneficiaryTableColumns } from './useCommunityBeneficiaryColumn';
import { useParams, usePathname } from 'next/navigation';
// import { useCommunityBeneficiaryTableColumns } from './useBeneficiaryColumns';

function ViewCommunityBeneficiaryByGroupName() {
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
    resetSelectedListItems,
  } = usePagination();

  const { uuid } = useParams();
  const debouncedFilters = useDebounce(filters, 500);
  const { setCommunityBeneficiariesUUID, communityBeneficiariesUUID } =
    useBeneficiaryStore();

  const { data, isLoading } = useListTempBeneficiary(uuid as string, {
    ...pagination,
    ...(debouncedFilters as any),
  });
  const columns = useCommunityBeneficiaryTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.tempBeneficiaries || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  useEffect(() => {
    setCommunityBeneficiariesUUID(
      Object.keys(selectedListItems).filter((key) => selectedListItems[key]),
    );
  }, [selectedListItems, setCommunityBeneficiariesUUID]);

  useEffect(() => {
    if (communityBeneficiariesUUID.length === 0) {
      resetSelectedListItems();
    }
  }, [resetSelectedListItems, communityBeneficiariesUUID.length]);
  return (
    <Tabs defaultValue="list" className="h-full">
      <>
        <TabsContent value="list">
          <ListView
            table={table}
            setFilters={setFilters}
            filters={filters}
            pagination={pagination}
            setPagination={setPagination}
            loading={isLoading}
          />
        </TabsContent>

        <CustomPagination
          meta={data?.response?.meta || { total: 0, currentPage: 0 }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={data?.response?.meta?.total || 0}
        />
      </>
    </Tabs>
  );
}

export default ViewCommunityBeneficiaryByGroupName;
