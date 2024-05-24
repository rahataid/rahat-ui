'use client';

import {
  ColumnDef,
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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useCvaVendorsTableColumn } from './use.table.column';

// DUMMY DATA
const data = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    wallet: '0xABCD1234EFGH5678',
    phone: '+1234567890',
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    wallet: '0x1234ABCD5678EFGH',
    phone: '+0987654321',
  },
  {
    id: '3',
    name: 'Charlie',
    email: 'charlie@example.com',
    wallet: '0x5678EFGH1234ABCD',
    phone: '+1122334455',
  },
  {
    id: '4',
    name: 'David',
    email: 'david@example.com',
    wallet: '0xEFGH5678ABCD1234',
    phone: '+2233445566',
  },
  {
    id: '5',
    name: 'Eve',
    email: 'eve@example.com',
    wallet: '0x2345BCDA6789EFGH',
    phone: '+3344556677',
  },
  {
    id: '6',
    name: 'Frank',
    email: 'frank@example.com',
    wallet: '0xBCDA67892345EFGH',
    phone: '+4455667788',
  },
  {
    id: '7',
    name: 'Grace',
    email: 'grace@example.com',
    wallet: '0x6789EFGH2345BCDA',
    phone: '+5566778899',
  },
  {
    id: '8',
    name: 'Heidi',
    email: 'heidi@example.com',
    wallet: '0xEFGH6789345BCDA2',
    phone: '+6677889900',
  },
  {
    id: '9',
    name: 'Ivan',
    email: 'ivan@example.com',
    wallet: '0x345BCDA26789EFGH',
    phone: '+7788990011',
  },
  {
    id: '10',
    name: 'Judy',
    email: 'judy@example.com',
    wallet: '0xBCDA26789EFGH345',
    phone: '+8899001122',
  },
];
export default function VendorTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = useCvaVendorsTableColumn();

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
    <>
      <div className="w-full p-2 bg-secondary">
        <Table className="bg-card rounded border">
          <ScrollArea className="w-full h-[calc(100vh-138px)]">
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
      <div className="flex items-center justify-end space-x-2 p-2 border-t">
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
    </>
  );
}
