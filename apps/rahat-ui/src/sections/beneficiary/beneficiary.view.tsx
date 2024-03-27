'use client';
import { memo, useCallback, useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { usePagination } from '@rahat-ui/query';
import { Beneficiary } from '@rahataid/sdk/types';
import CustomPagination from '../../components/customPagination';
import { BENEFICIARY_NAV_ROUTE } from '../../constants/beneficiary.const';
import { useRumsanService } from '../../providers/service.provider';
import BeneficiaryDetail from '../../sections/beneficiary/beneficiaryDetail';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import ImportBeneficiary from './import.beneficiary';
import { useBeneficiaryTableColumns } from './useBeneficiaryColumns';

function BeneficiaryView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { beneficiaryQuery } = useRumsanService();
  const [selectedData, setSelectedData] = useState<Beneficiary>();
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

  const handleBeneficiaryClick = useCallback((item: Beneficiary) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  const handleNav = useCallback((item: string) => {
    setActive(item);
    setSelectedData(null);
  }, []);

  const { data } = beneficiaryQuery.useBeneficiaryList({
    ...pagination,
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useBeneficiaryTableColumns();

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

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BeneficiaryNav
            handleNav={handleNav}
            meta={data?.response?.meta}
            active={active}
            table={table}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY ? (
            <ImportBeneficiary />
          ) : null}

          {active === BENEFICIARY_NAV_ROUTE.DEFAULT && (
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
          )}
        </ResizablePanel>
        {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={28} defaultSize={28}>
              {selectedData && (
                <BeneficiaryDetail
                  data={selectedData}
                  handleClose={handleClose}
                />
              )}
              {/* {addBeneficiary && <AddBeneficiary />} */}
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </Tabs>
  );
}

export default memo(BeneficiaryView);
