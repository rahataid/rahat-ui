'use client';

import { useBeneficiaryStore, usePagination } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { ChevronDown, Settings2 } from 'lucide-react';
import { useState } from 'react';
import BeneficiaryDetail from './beneficiary.detail';
import { useCvaBeneficiaryTableColumns } from './use.table.column';
import AssignTokenModal from './assign.token.modal';

export default function BeneficiaryTable() {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleNextPage = () => setCurrentPage(currentPage + 1);

  const handlePrevPage = () => setCurrentPage(currentPage - 1);
  const beneficiaries = useBeneficiaryStore((state) => state.beneficiaries);
  console.log({ beneficiaries });
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
    resetFilters,
  } = usePagination();
  const columns = useCvaBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const selectedRowAddresses = Object.keys(selectedListItems);

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
              <AssignTokenModal beneficiaries={selectedRowAddresses.length} />
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
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => {
                        setSecondPanelComponent(
                          <BeneficiaryDetail
                            data={row}
                            handleClose={closeSecondPanel}
                          />,
                        );
                      }}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </TableComponent>
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={handleNextPage}
            handlePageSizeChange={setPerPage}
            handlePrevPage={handlePrevPage}
            perPage={pagination.perPage}
            meta={meta || { total: 0, currentPage: 0 }}
          />
        </div>
      </div>
    </>
  );
}
