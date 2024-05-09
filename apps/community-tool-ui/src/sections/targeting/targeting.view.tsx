'use client';
import { useState } from 'react';

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

import {
  useTargetedBeneficiaryList,
  useTargetingCreate,
  useTargetingLabelUpdate,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Result } from '@rahataid/community-tool-sdk/targets';
import CustomPagination from '../../components/customPagination';
import { TARGETING_NAV_ROUTE } from '../../constants/targeting.const';
import TargetingListView from '../../sections/targeting/listView';
import TargetingNav from '../../sections/targeting/targeting.nav';
import useTargetingFormStore from '../../targetingFormBuilder/form.store';
import { ITargetingQueries } from '../../types/targeting';
import { useTargetingColumns } from './useTargetingColumns';

export default function TargetingView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const [targetUUID, setTargetUUID] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: beneficiaryData } = useTargetedBeneficiaryList(
    targetUUID as string,
  );

  const addTargeting = useTargetingCreate();
  const updateTargetLabel = useTargetingLabelUpdate();

  const columns = useTargetingColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data:
      beneficiaryData?.data?.rows?.map((item: Result) => item?.beneficiary) ||
      [],
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

  const [active, setActive] = useState<string>(TARGETING_NAV_ROUTE.DEFAULT);

  const { targetingQueries } = useTargetingFormStore();

  const handleTargetFormSubmit = async (formData: ITargetingQueries) => {
    setLoading(true);
    const payload = { ...formData, ...targetingQueries };

    const getTargetInfo = await addTargeting.mutateAsync({
      filterOptions: [{ data: payload }],
    });
    setTargetUUID(getTargetInfo?.data?.uuid);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleUpdateTargetLabel = async (label: string) => {
    const uuid = targetUUID as string;
    const payload = { label };
    await updateTargetLabel.mutateAsync({ uuid, payload });
  };

  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max border">
        <ResizablePanel
          defaultSize={20}
          minSize={20}
          maxSize={20}
          className="h-full"
        >
          <TargetingNav onFormSubmit={handleTargetFormSubmit} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={28}>
          {active === TARGETING_NAV_ROUTE.DEFAULT && (
            <>
              <TabsContent value="list">
                <TargetingListView
                  loading={loading}
                  table={table}
                  handleUpdateTargetLabel={handleUpdateTargetLabel}
                  targetUUID={targetUUID as string}
                />
              </TabsContent>

              <CustomPagination
                meta={
                  beneficiaryData?.response?.meta || {
                    total: 0,
                    currentPage: 0,
                  }
                }
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
      </ResizablePanelGroup>
    </Tabs>
  );
}
