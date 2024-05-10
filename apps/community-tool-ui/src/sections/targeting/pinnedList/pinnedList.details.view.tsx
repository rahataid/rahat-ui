'use client';
import { useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useTargetedBeneficiaryList } from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import CustomPagination from '../../../components/customPagination';
import DetailsTable from './detailsTable';
import { useTargetPinnedListDetailsTableColumns } from './useTargetLabelColumns';

export default function PinnedListDetailsView() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { uuid } = useParams();

  const { data: beneficiaryData } = useTargetedBeneficiaryList(uuid as string);
  const columns = useTargetPinnedListDetailsTableColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaryData?.data?.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => String(row.targetUuid),
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <>
      <DetailsTable table={table} />

      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={beneficiaryData?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={beneficiaryData?.response?.meta?.total || 0}
      />
    </>
  );
}
