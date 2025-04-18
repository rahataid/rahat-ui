import {
  useCambodiaVendorLeadConversions,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import CambodiaTable from '../table.component';
import { useTransactionHistoryTableColumns } from './use.transaction.history.table.columns';
import { useConversionListTableColumns } from './use.conversion.list.table.columns';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function ConversionListView() {
  const { id, vendorId } = useParams() as { id: UUID; vendorId: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    setPagination,
    resetSelectedListItems,
  } = usePagination();
  const { data: leadConversions, isLoading } = useCambodiaVendorLeadConversions(
    {
      projectUUID: id,
      vendorId,
      ...pagination,
      ...filters,
    },
  ) as any;
  const columns = useConversionListTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: leadConversions?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="rounded border bg-card p-4">
        <CambodiaTable
          table={table}
          tableHeight="h-[calc(100vh-590px)]"
          loading={isLoading}
        />
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={
          (leadConversions?.response?.meta as any) || {
            total: 0,
            currentPage: 0,
          }
        }
        perPage={pagination?.perPage}
        total={leadConversions?.response?.meta?.total || 0}
      />
    </>
  );
}
