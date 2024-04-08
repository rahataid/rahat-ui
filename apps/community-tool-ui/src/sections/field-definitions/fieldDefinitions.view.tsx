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

import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import CustomPagination from '../../components/customPagination';
import { FIELD_DEFINITON_NAV_ROUTE } from '../../constants/fieldDefinition.const';
import FieldDefinitionsDetail from '../../sections/field-definitions/fieldDefinitionsDetail';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import FieldDefinitionsListView from '../../sections/field-definitions/listView';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import { useFieldDefinitionsList } from '@rahat-ui/community-query'; // replace it
import { usePagination } from '@rahat-ui/query';
import { useFieldDefinitionsTableColumns } from './useFieldDefinitionsColumns';
// import { useSecondPanel } from '../../providers/second-panel-provider';

export default function FieldDefinitionsView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data } = useFieldDefinitionsList(pagination);

  const columns = useFieldDefinitionsTableColumns();
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
    getRowId: (row) => String(row.id),
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const [selectedData, setSelectedData] = useState<FieldDefinition | null>();
  const [selectedFieldDefId, setSelectedFieldDefId] = useState<number[]>([]);
  const [active, setActive] = useState<string>(
    FIELD_DEFINITON_NAV_ROUTE.DEFAULT,
  );

  const handleFieldDefClick = useCallback((item: FieldDefinition) => {
    setSelectedData(item);
    setSelectedFieldDefId((prevSelectedData) => {
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
            selectedBenefID={selectedFieldDefId}
            // handleClear={handleclear}
            setSelectedBenefId={setSelectedFieldDefId}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {/* {active === BENEFICIARY_NAV_ROUTE.UPLOAD_BENEFICIARY && (
            <ImportBeneficiary />
          )} */}

          {active === FIELD_DEFINITON_NAV_ROUTE.DEFAULT && (
            <>
              <TabsContent value="list">
                <FieldDefinitionsListView
                  table={table}
                  handleClick={handleFieldDefClick}
                />
              </TabsContent>
              <TabsContent value="grid">
                {/* <BeneficiaryGridView
                  handleClick={handleFieldDefClick}
                  data={data?.data?.rows}
                /> */}
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
          {/* {active === GROUP_NAV_ROUTE.VIEW_GROUP && <ViewGroup />} */}
        </ResizablePanel>
        {selectedData ? (
          <>
            <ResizableHandle />
            <ResizablePanel minSize={24}>
              <FieldDefinitionsDetail
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
