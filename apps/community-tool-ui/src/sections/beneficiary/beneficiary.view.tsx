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
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from '@tanstack/react-table';

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
import ImportBeneficiary from './import.beneficiary';
import ViewGroup from '../group/group.view';
import { useCommunityBeneficaryList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { useCommunityBeneficiaryTableColumns } from './useBeneficiaryColumns';
// import { useSecondPanel } from '../../providers/second-panel-provider';

function BeneficiaryView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data } = useCommunityBeneficaryList(pagination);
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
                />
              </TabsContent>
              <TabsContent value="grid">
                <BeneficiaryGridView
                  handleClick={handleBeneficiaryClick}
                  data={data?.data?.rows}
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
