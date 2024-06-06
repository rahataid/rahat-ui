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

import { usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '../../utils/useDebouncehooks';
import ListView from './list.view';
import { useCommunityBeneficiaryTableColumns } from './useBeneficiaryColumns';

function ViewCommunityBeneficiary() {
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

  const debouncedFilters = useDebounce(filters, 500);

  //   const { data } = useCommunityBeneficaryList({
  //     ...pagination,
  //     ...(debouncedFilters as any),
  //   });

  const columns = useCommunityBeneficiaryTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: [],
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

  //   useEffect(() => {
  //     setSelectedBeneficiaries(
  //       Object.keys(selectedListItems).filter((key) => selectedListItems[key]),
  //     );
  //   }, [selectedListItems, setSelectedBeneficiaries]);

  //   useEffect(() => {
  //     if (selectedBeneficiaries.length === 0) {
  //       resetSelectedListItems();
  //     }
  //   }, [resetSelectedListItems, selectedBeneficiaries.length]);

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
          />
        </TabsContent>

        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          meta={{ total: 0, currentPage: 0 }}
          perPage={pagination?.perPage}
          total={0}
        />
      </>
    </Tabs>
  );
}

export default ViewCommunityBeneficiary;
