'use client';
import { useCallback, useState } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useCommunityBeneficaryList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import CustomPagination from '../../components/customPagination';
import {
  BENEFICIARY_NAV_ROUTE,
  GROUP_NAV_ROUTE,
} from '../../constants/beneficiary.const';
import BeneficiaryDetail from '../../sections/beneficiary/beneficiaryDetail';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import { useDebounce } from '../../utils/debounceHooks';
import ViewGroup from '../group/group.view';
import ImportBeneficiary from './import.beneficiary';
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
  } = usePagination();

  const debouncedFilters = useDebounce(filters, 500);

  const { data } = useCommunityBeneficaryList({
    ...pagination,
    ...(debouncedFilters as any),
  });
  const columns = useCommunityBeneficiaryTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // const { closeSecondPanel, setSecondPanelComponent } = useSecondPanel();
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

  console.log('beneflist', data);

  const [selectedData, setSelectedData] = useState(null) as any;
  const [selectedBenefId, setSelectedBenefId] = useState<number[]>([]);
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

  const handleBeneficiaryClick = useCallback((item: ListBeneficiary) => {
    setSelectedData(item);
    setSelectedBenefId((prevSelectedData) => {
      const isSelected = prevSelectedData?.includes(item.id);

      if (isSelected) {
        return prevSelectedData.filter((selectedId) => selectedId !== item.id);
      } else {
        return [...(prevSelectedData || []), item.id];
      }
    });
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BeneficiaryNav
            meta={data?.response?.meta}
            selectedBenefID={selectedBenefId}
            // handleClear={handleclear}
            setSelectedBenefId={setSelectedBenefId}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === BENEFICIARY_NAV_ROUTE.UPLOAD_BENEFICIARY && (
            <ImportBeneficiary />
          )}

          {active === BENEFICIARY_NAV_ROUTE.DEFAULT && (
            <>
              <TabsContent value="list">
                <BeneficiaryListView
                  table={table}
                  handleClick={handleBeneficiaryClick}
                  setFilters={setFilters}
                  filters={filters}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              </TabsContent>
              <TabsContent value="grid">
                <BeneficiaryGridView
                  handleClick={handleBeneficiaryClick}
                  data={data?.data?.rows}
                />
              </TabsContent>

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
          )}
          {active === GROUP_NAV_ROUTE.VIEW_GROUP && <ViewGroup />}
        </ResizablePanel>
        {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={24}>
              <BeneficiaryDetail
                handleClose={handleClose}
                data={selectedData}
              />
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </Tabs>
  );
}

export default BeneficiaryView;
