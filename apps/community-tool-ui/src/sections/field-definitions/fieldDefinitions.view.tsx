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
import FieldDefinitionsListView from '../../sections/field-definitions/listView';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import { useFieldDefinitionsList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { useFieldDefinitionsTableColumns } from './useFieldDefinitionsColumns';

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
  const [active, setActive] = useState<string>(
    FIELD_DEFINITON_NAV_ROUTE.DEFAULT,
  );

  const handleFieldDefClick = useCallback((item: FieldDefinition) => {
    setSelectedData(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BeneficiaryNav meta={data?.response?.meta} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === FIELD_DEFINITON_NAV_ROUTE.DEFAULT && (
            <>
              <TabsContent value="list">
                <FieldDefinitionsListView
                  table={table}
                  handleClick={handleFieldDefClick}
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
            <ResizablePanel minSize={36}>
              <FieldDefinitionsDetail
                handleClose={handleClose}
                fieldDefinitionData={selectedData}
              />
            </ResizablePanel>
          </>
        ) : null}
      </ResizablePanelGroup>
    </Tabs>
  );
}
