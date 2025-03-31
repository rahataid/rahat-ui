'use client';
import * as React from 'react';

import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useProjectBeneficiaryTableColumns } from './useBeneficiaryColumns';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import Image from 'next/image';
import DataTableServerSidePagination from '../transactions/dataTableServerSidePagination';

const BeneficiaryDetailTableView = () => {
  const uuid = useParams().id as UUID;
  const route = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const {
    pagination,
    filters,
    setNextPage,
    setPrevPage,
    setFirstPage,
    setLastPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
  } = usePagination();
  const selectedRowAddresses = Object.keys(selectedListItems);
  const queryString = selectedRowAddresses.join(',');
  const columns = useProjectBeneficiaryTableColumns();
  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: uuid,
    ...filters,
  });
  const table = useReactTable({
    manualPagination: true,
    data: projectBeneficiaries?.data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.walletAddress,
    onRowSelectionChange: setSelectedListItems,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  const meta = projectBeneficiaries.data.response?.meta;
  return (
    <>
      <div className="p-2 bg-secondary">
        <div className="flex justify-between items-center mb-2">
          <div className="flex w-full">
            <Input
              placeholder="Search beneficiary..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) => {
                table.getColumn('name')?.setFilterValue(event.target.value);
              }}
              className="rounded mr-2"
            />
          </div>
          {selectedRowAddresses.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-4 p-2">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded"
                    onClick={() =>
                      route.push(
                        `/projects/c2c/${uuid}/beneficiary/disburse-flow?selectedBeneficiaries=${encodeURIComponent(
                          queryString,
                        )}`,
                      )
                    }
                  >
                    Disburse USDC (
                    <span className="text-sm text-gray-50 ml-2">
                      {selectedRowAddresses.length} selected
                    </span>
                    )
                  </Button>
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>
          ) : null}
        </div>
        <div className="rounded border bg-card">
          <Table>
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
                {projectBeneficiaries.isFetching ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <TableLoader />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
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
                            There are no beneficiaries to display at the moment.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
      </div>
      <DataTableServerSidePagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handleFirstPage={setFirstPage}
        handleLastPage={setLastPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </>
  );
};

export default BeneficiaryDetailTableView;
