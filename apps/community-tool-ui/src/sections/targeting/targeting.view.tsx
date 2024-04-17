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
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import CustomPagination from '../../components/customPagination';
import { TARGETING_NAV_ROUTE } from '../../constants/targeting.const';
import TargetingListView from '../../sections/targeting/listView';
import TargetingNav from '../../sections/targeting/targeting.nav';
import { usePagination } from '@rahat-ui/query';
import { useTargetingColumns } from './useTargetingColumns';
// import { useTargetingList } from '@rahat-ui/community-query';

export default function TargetingView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  // const { data } = useTargetingList();

  const columns = useTargetingColumns();
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
    getRowId: (row) => String(row.id),
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const [selectedData, setSelectedData] = useState<ListBeneficiary | null>();
  const [active, setActive] = useState<string>(TARGETING_NAV_ROUTE.DEFAULT);

  const handleFieldDefClick = useCallback((item: ListBeneficiary) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <TargetingNav />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === TARGETING_NAV_ROUTE.DEFAULT && (
            <>
              <TabsContent value="list">
                <TargetingListView
                  table={table}
                  handleClick={handleFieldDefClick}
                />
              </TabsContent>

              <CustomPagination
                meta={{ total: 0, currentPage: 0 }}
                handleNextPage={setNextPage}
                handlePrevPage={setPrevPage}
                handlePageSizeChange={setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={0}
              />
            </>
          )}
        </ResizablePanel>
        {/* {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={36}>
              <FieldDefinitionsDetail
                handleClose={handleClose}
                fieldDefinitionData={selectedData}
              />
            </ResizablePanel>
          </>
        ) : null} */}
      </ResizablePanelGroup>
    </Tabs>
  );
}
