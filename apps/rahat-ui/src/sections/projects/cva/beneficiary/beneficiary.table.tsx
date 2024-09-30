'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useBeneficiaryStore,
  useBulkAssignClaimsToBeneficiaries,
  usePagination,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { UUID } from 'crypto';
import { ChevronDown, Plus, Settings2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import BulkAssignToken from './bulk-assign-token.modal';
import { useCvaBeneficiaryTableColumns } from './use.table.column';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import Image from 'next/image';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

export default function BeneficiaryTable() {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const bulkAssignTokens = useBulkAssignClaimsToBeneficiaries();

  const { id } = useParams() as { id: UUID };
  const contractSettings = useProjectSettingsStore(
    (state) => state?.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] as any,
  );

  // const beneficiaries = useBeneficiaryStore((state) => state.beneficiaries);
  // console.log({ beneficiaries });
  const meta = useBeneficiaryStore((state) => state.meta);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();
  const columns = useCvaBeneficiaryTableColumns();

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
  });

  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId(originalRow, index, parent) {
      console.log('originalRow', originalRow);
      return originalRow.walletAddress;
    },
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const selectedRowAddresses = Object.keys(selectedListItems);

  const handleBulkAssignTokens = async (numberOfTokens: string) => {
    await bulkAssignTokens.mutateAsync({
      beneficiaryAddresses: selectedRowAddresses as any,
      tokenAmount: numberOfTokens,
      projectAddress: contractSettings?.cvaproject.address,
    });
  };

  return (
    <>
      <div className="w-full p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter beneficiary..."
            value={
              (table.getColumn('walletAddress')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn('walletAddress')
                ?.setFilterValue(event.target.value)
            }
            className="rounded mr-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-5" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                // disabled={assignVoucher.isPending}
                className="h-10 ml-2"
              >
                {selectedRowAddresses.length} - Beneficiary Selected
                <ChevronDown strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="flex flex-col p-3 gap-2"
            >
              <BulkAssignToken
                loading={bulkAssignTokens.isPending}
                beneficiaries={selectedRowAddresses.length}
                handleSubmit={handleBulkAssignTokens}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded border bg-card">
          <TableComponent>
            <ScrollArea className="h-[calc(100vh-182px)]">
              <TableHeader className="bg-card sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {beneficiaries.isFetching ? (
                        <TableLoader />
                      ) : (
                        <div className="w-full h-[calc(100vh-140px)]">
                          <div className="flex flex-col items-center justify-center">
                            <Image
                              src="/noData.png"
                              height={250}
                              width={250}
                              alt="no data"
                            />
                            <p className="text-medium text-base mb-1">
                              No Data Available
                            </p>
                            <p className="text-sm mb-4 text-gray-500">
                              There are no beneficiaries to display at the
                              moment
                            </p>
                            <Button
                            // onClick={() =>
                            //   router.push(
                            //     `/projects/rp/${id}/beneficiary/add`,
                            //   )
                            // }
                            >
                              {' '}
                              <Plus
                                className="mr-2"
                                size={20}
                                strokeWidth={1.5}
                              />
                              Add Beneficiary Data
                            </Button>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </TableComponent>
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePageSizeChange={setPerPage}
            handlePrevPage={setPrevPage}
            perPage={pagination.perPage}
            meta={meta || { total: 0, currentPage: 0 }}
          />
        </div>
      </div>
    </>
  );
}
