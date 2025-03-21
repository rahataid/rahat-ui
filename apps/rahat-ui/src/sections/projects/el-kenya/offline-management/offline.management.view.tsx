import {
  useGetOfflineVendors,
  usePagination,
  useProjectBeneficiaries,
  useProjectStore,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import useTableColumn from './use.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Plus } from 'lucide-react';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import ClientSidePagination from '../../components/client.side.pagination';

export default function OfflineManagementView() {
  const router = useRouter();
  const { id, Id } = useParams() as { id: UUID; Id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

  const {
    data: offlineVendors,
    isSuccess,
    isLoading,
  } = useGetOfflineVendors(id as UUID);
  const columns = useTableColumn();
  const table = useReactTable({
    // manualPagination: true,
    data: offlineVendors || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      // rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-[28px]">Offline Management</h1>
          <p className="text-muted-foreground text-base">
            Here is the list of all the vendors
          </p>
        </div>
        <div className="rounded border bg-card p-4 pb-0">
          <div className="flex justify-between space-x-2 mb-2">
            {/* To do server side filtering */}
            <SearchInput
              className="w-full"
              name="vendors"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
            />
            <Button
              type="button"
              onClick={() =>
                router.push(`/projects/el-kenya/${id}/offline-management/setup`)
              }
              disabled={projectClosed}
            >
              <Plus size={18} className="mr-1" />
              Setup offline beneficiary
            </Button>
          </div>
          <ElkenyaTable
            table={table}
            tableHeight="h-[calc(100vh-293px)]"
            loading={isLoading}
          />
          {/* <Pagination
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            setPageSize={table.setPageSize}
            canPreviousPage={table.getCanPreviousPage()}
            previousPage={table.previousPage}
            canNextPage={table.getCanNextPage()}
            nextPage={table.nextPage}
          /> */}
          <ClientSidePagination table={table} />
        </div>
      </div>
    </>
  );
}
