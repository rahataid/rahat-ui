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
import { useRedemptionTableColumn } from './useRedemptionTableColumn';
import { History } from 'lucide-react';
import Image from 'next/image';

export type Redeptions = {
  id: string;
  name: string;
  amount: number;
  status: string;
};

const initialData: Redeptions[] = [
  {
    id: '1',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
  {
    id: '2',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
  {
    id: '4',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
  {
    id: '5',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
  {
    id: '6',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
  {
    id: '7',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
  {
    id: '8',
    name: 'Aadarsha Lamichhane',
    amount: 9000,
    status: 'Paid',
  },
];

export default function RedemptionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState(initialData);
  const columns = useRedemptionTableColumn();
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
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Search Redemptions..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
        <Button className="flex items-center gap-2">
          <History strokeWidth={1.25} size={18} />
          History
        </Button>
      </div>
      <div className="rounded border bg-card">
        {table.getRowModel().rows?.length ? (
          <>
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
                  {table.getRowModel().rows.map((row) => (
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
                  ))}
                </TableBody>
              </ScrollArea>
            </Table>
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
          </>
        ) : (
          <div className="w-full h-[calc(100vh-140px)]">
            <div className="flex flex-col items-center justify-center">
              <Image src="/noData.png" height={250} width={250} alt="no data" />
              <p className="text-medium text-base mb-1">No Data Available</p>
              <p className="text-sm mb-4 text-gray-500">
                There are no redemptions to display at the moment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
