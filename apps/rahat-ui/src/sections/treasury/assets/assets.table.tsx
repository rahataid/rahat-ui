'use client';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useAssetsTableColumn } from './use-table-column';

export type Assets = {
  id: string;
  name: string;
  amount: number;
  status: string;
  action: string;
};

const initialData: Assets[] = [
  {
    id: '1',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
  {
    id: '2',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Pending',
    action: 'view',
  },
  {
    id: '3',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
  {
    id: '4',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
  {
    id: '5',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
  {
    id: '6',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
  {
    id: '7',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
  {
    id: '8',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
    action: 'view',
  },
];

export default function AssetsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState(initialData);
  const columns = useAssetsTableColumn();

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
    <div className="w-full p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Search Name..."
          value={(table?.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded border bg-card">
        <Table>
          <ScrollArea className="h-[calc(100vh-184px)]">
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
      <div className="flex items-center justify-end space-x-2 py-2">
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
