'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
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
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';
import { Transaction, useTableColumns } from './useTableColumns';

const data: Transaction[] = [
  {
    topic: 'Received',
    from: '0x82c9cdb8d012b740b995ee073bab6f39d003d280',
    to: 'C2C',
    timestamp: '6/13/2024',
    blockNumber: '11242152',
    transactionHash: '0x22969587b0c9b0...Fa87448d725611',
    amount: 100.0,
  },
  {
    topic: 'Received',
    from: '0x4c8043d202f7df7b8f7e5acdef015a0fd2619d64',
    to: 'C2C',
    timestamp: '6/17/2024',
    blockNumber: '11247472',
    transactionHash: '0x9a5f687f38e2e4b...4f18a28f7b1e4a',
    amount: 1000.0,
  },
  {
    topic: 'Received',
    from: '0x82c9cdb8d012b740b995ee073bab6f39d003d280',
    to: 'C2C',
    timestamp: '6/13/2024',
    blockNumber: '11196961',
    transactionHash: '0x46e639d912b2e2...7160f14d431d3f',
    amount: 100.0,
  },
  {
    topic: 'Received',
    from: '0x82c9cdb8d012b740b995ee073bab6f39d003d280',
    to: 'C2C',
    timestamp: '6/24/2024',
    blockNumber: '11191352',
    transactionHash: '0xa960f289dfc7a2...28f6ad7d318f81',
    amount: 200.0,
  },
  {
    topic: 'Received',
    from: '0x8de032f67b3bf85103ff5afde067583dd5031280',
    to: 'C2C',
    timestamp: '6/11/2024',
    blockNumber: '11170112',
    transactionHash: '0x687a313d709d74...f4af66303000',
    amount: 10000.0,
  },
  {
    topic: 'Received',
    from: '0x4c8043d202f7df7b8f7e5acdef015a0fd2619d64',
    to: 'C2C',
    timestamp: '6/13/2024',
    blockNumber: '11250107',
    transactionHash: '0x5a977a2c65b9cb...25944730d9612c',
    amount: 1000.0,
  },
  {
    topic: 'Received',
    from: '0x4c8043d202f7df7b8f7e5acdef015a0fd2619d64',
    to: 'C2C',
    timestamp: '6/28/2024',
    blockNumber: '11893702',
    transactionHash: '0x68022bc3c500c8...3d0c9f2430f1',
    amount: 500.0,
  },
  {
    topic: 'Received',
    from: '0x4c8043d202f7df7b8f7e5acdef015a0fd2619d64',
    to: 'C2C',
    timestamp: '6/12/2024',
    blockNumber: '11248582',
    transactionHash: '0x1b1587ef1e19d3...a8d585c8f99ce5c',
    amount: 1000.0,
  },
  {
    topic: 'Received',
    from: '0x4c8043d202f7df7b8f7e5acdef015a0fd2619d64',
    to: 'C2C',
    timestamp: '6/14/2024',
    blockNumber: '11243150',
    transactionHash: '0x80a01b4a4c3d0f...2f9e9c1e9ae3122',
    amount: 10000.0,
  },
  {
    topic: 'Received',
    from: '0x4c8043d202f7df7b8f7e5acdef015a0fd2619d64',
    to: 'C2C',
    timestamp: '6/12/2024',
    blockNumber: '11203357',
    transactionHash: '0x34cc94d0f079f3...0f3f52ef14',
    amount: 500.0,
  },
];

export function TransactionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = useTableColumns();

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
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter transactions..."
          value={(table.getColumn('from')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('from')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <ScrollArea className="h-[calc(100vh-190px)]">
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
