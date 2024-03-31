'use client';
import { memo, useState } from 'react';

import { TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useBeneficiaryList, usePagination } from '@rahat-ui/query';
import CustomPagination from '../../components/customPagination';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import { useBeneficiaryTableColumns } from './useBeneficiaryColumns';
import { useSecondPanel } from '../../providers/second-panel-provider';
import BeneficiaryDetail from './beneficiaryDetail';

function BeneficiaryView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data } = useBeneficiaryList(pagination);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();
  const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();

  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleBeneficiaryClick = (row: any) => {
    setSecondPanelComponent(
      <BeneficiaryDetail data={row} handleClose={closeSecondPanel} />,
    );
  };

  return (
    <>
      <TabsContent value="list">
        <BeneficiaryListView
          table={table}
          meta={data?.meta}
          handleClick={handleBeneficiaryClick}
        />
      </TabsContent>
      <TabsContent value="grid">
        <BeneficiaryGridView
          handleClick={handleBeneficiaryClick}
          data={data?.data}
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
  );
}

export default memo(BeneficiaryView);
