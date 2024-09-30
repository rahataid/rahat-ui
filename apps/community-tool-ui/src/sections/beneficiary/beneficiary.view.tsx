'use client';
import { useCallback, useEffect, useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  OnChangeFn,
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
import CustomPagination from '../../components/customPagination';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import { useDebounce } from '../../utils/debounceHooks';
import { useCommunityBeneficiaryTableColumns } from './useBeneficiaryColumns';
import {
  getTableDisplayField,
  setTableDisplayField,
} from '../../utils/localstorage.utils';

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

  const { isLoading, data } = useCommunityBeneficaryList({
    ...pagination,
    ...(debouncedFilters as any),
  });

  const columns = useCommunityBeneficiaryTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const storedVisibility = getTableDisplayField();
      return storedVisibility;
    },
  );
  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (
    updaterOrValue,
  ) => {
    const newVisibility =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnVisibility)
        : updaterOrValue;

    setColumnVisibility(newVisibility);
    setTableDisplayField(JSON.stringify(newVisibility));
  };
  const table = useReactTable({
    manualPagination: true,
    data: data?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid as string,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

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

  console.log(columnVisibility);
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
            loading={isLoading}
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
