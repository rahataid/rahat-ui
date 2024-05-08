'use client';
import { useCallback, useEffect, useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  useCommunityBeneficaryList,
  useCommunityBeneficiaryStore,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import CustomPagination from '../../components/customPagination';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import { useDebounce } from '../../utils/debounceHooks';
import { useCommunityBeneficiaryTableColumns } from './useBeneficiaryColumns';

function BeneficiaryView() {
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
  const { setSelectedBeneficiaries, selectedBeneficiaries } =
    useCommunityBeneficiaryStore();

  const { data } = useCommunityBeneficaryList({
    ...pagination,
    ...(debouncedFilters as any),
  });

  const columns = useCommunityBeneficiaryTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
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

  const [selectedData, setSelectedData] = useState(null) as any;

  const handleBeneficiaryClick = useCallback((item: ListBeneficiary) => {
    setSelectedData(item);
  }, []);

  useEffect(() => {
    setSelectedBeneficiaries(
      Object.keys(selectedListItems).filter((key) => selectedListItems[key]),
    );
  }, [selectedListItems, setSelectedBeneficiaries]);

  useEffect(() => {
    if (selectedBeneficiaries.length === 0) {
      resetSelectedListItems();
    }
  }, [resetSelectedListItems, selectedBeneficiaries.length]);

  return (
    <Tabs defaultValue="list" className="h-full">
      <>
        <TabsContent value="list">
          <BeneficiaryListView
            table={table}
            setFilters={setFilters}
            filters={filters}
            pagination={pagination}
            setPagination={setPagination}
          />
        </TabsContent>
        {/* <TabsContent value="grid">
          <BeneficiaryGridView
            handleClick={handleBeneficiaryClick}
            data={data?.data?.rows}
          />
        </TabsContent> */}

        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          meta={data?.response?.meta || { total: 0, currentPage: 0 }}
          perPage={pagination?.perPage}
          total={data?.response?.meta?.total || 0}
        />
      </>
    </Tabs>
  );
}

export default BeneficiaryView;
