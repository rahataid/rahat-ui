'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import { useTableColumn } from './useTableColumn';
import { Router } from 'next/router';
import { useParams, useRouter } from 'next/navigation';

export function OfflineTable() {
  const route = useRouter();
  const { id } = useParams();

  const data = [
    {
      id: 'm5gr84i9',
      vendor: 'vendor1',
      beneficiary: 45,
      tokenAssigned: 180,
    },
    {
      id: '3u1reuv4',
      vendor: 'vendor2',
      beneficiary: 45,
      tokenAssigned: 400,
    },
    {
      id: 'derv1ws0',
      vendor: 'vendor3',
      beneficiary: 55,
      tokenAssigned: 300,
    },
    {
      id: '5kma53ae',
      vendor: 'vendor4',
      beneficiary: 45,
      tokenAssigned: 200,
    },
    {
      id: 'bhqecj4p',
      vendor: 'vendor5',
      beneficiary: 22,
      tokenAssigned: 100,
    },
    {
      id: 'm5gr84i9',
      vendor: 'vendor1',
      beneficiary: 45,
      tokenAssigned: 180,
    },
    {
      id: '3u1reuv4',
      vendor: 'vendor2',
      beneficiary: 45,
      tokenAssigned: 400,
    },
    {
      id: 'derv1ws0',
      vendor: 'vendor3',
      beneficiary: 55,
      tokenAssigned: 300,
    },
    {
      id: '5kma53ae',
      vendor: 'vendor4',
      beneficiary: 45,
      tokenAssigned: 200,
    },
    {
      id: 'bhqecj4p',
      vendor: 'vendor5',
      beneficiary: 22,
      tokenAssigned: 100,
    },
    {
      id: 'm5gr84i9',
      vendor: 'vendor1',
      beneficiary: 45,
      tokenAssigned: 180,
    },
    {
      id: '3u1reuv4',
      vendor: 'vendor2',
      beneficiary: 45,
      tokenAssigned: 400,
    },
    {
      id: 'derv1ws0',
      vendor: 'vendor3',
      beneficiary: 55,
      tokenAssigned: 300,
    },
    {
      id: '5kma53ae',
      vendor: 'vendor4',
      beneficiary: 45,
      tokenAssigned: 200,
    },
    {
      id: 'bhqecj4p',
      vendor: 'vendor5',
      beneficiary: 22,
      tokenAssigned: 100,
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = useTableColumn();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center gap-2 py-4">
        <Input
          placeholder="Search Vendors"
          value={(table.getColumn('vendors')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('vendors')?.setFilterValue(event.target.value)
          }
          className="rounded-md"
        />
        <Button
          onClick={() =>
            route.push(`/projects/rp/${id}/offlineManagement/setupBeneficiary`)
          }
          className="rounded-md"
        >
          Setup Offline Beneficiary
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <ScrollArea className="h-[calc(100vh-365px)]">
            <TableHeader>
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
