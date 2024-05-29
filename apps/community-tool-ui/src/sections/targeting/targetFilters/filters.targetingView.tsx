'use client';
import { useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  useCommunityTargetingStore,
  useTargetedBeneficiaryList,
  useTargetingLabelUpdate,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { Result } from '@rahataid/community-tool-sdk/targets';
import CustomPagination from '../../../components/customPagination';
import { useTargetingColumns } from '../useTargetingColumns';
import FilterTargetingListView from './filters.listView';
import { useRouter } from 'next/navigation';
import { paths } from '../../../routes/paths';
import Swal from 'sweetalert2';
import useTargetingFormStore from '../../../targetingFormBuilder/form.store';

export default function FiltersTargetingView() {
  const { setTargetingQueries }: any = useTargetingFormStore();
  const router = useRouter();
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { loading, targetUUID, setTargetUUID } = useCommunityTargetingStore();

  const { data: beneficiaryData } = useTargetedBeneficiaryList(
    targetUUID as string,
    {
      ...pagination,
      perPage: 50,
    },
  );

  const updateTargetLabel = useTargetingLabelUpdate();

  console.log(beneficiaryData?.data?.rows);

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

  const handleUpdateTargetLabel = async (label: string) => {
    if (!beneficiaryData?.data?.rows.length)
      return Swal.fire({ title: 'No beneficiaries to pin!', icon: 'error' });
    const uuid = targetUUID as string;
    const payload = { label };
    await updateTargetLabel.mutateAsync({ uuid, payload });
    setTargetingQueries([]);
    setTargetUUID('');
    router.push(paths.dashboard.targeting.list);
  };

  return (
    <Tabs defaultValue="list" className="h-full">
      <FilterTargetingListView
        loading={loading}
        table={table}
        handleUpdateTargetLabel={handleUpdateTargetLabel}
        targetUUID={targetUUID as string}
      />

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
        total={beneficiaryData?.response?.meta?.total || 0}
      />
    </Tabs>
  );
}
