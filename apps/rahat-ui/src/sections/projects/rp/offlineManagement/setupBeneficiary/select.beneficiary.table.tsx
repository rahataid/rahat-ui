'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
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
  ColumnDef,
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
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
  {
    id: 'm5gr84i9',
    name: 'Beneficiary1',
    tokenAssigned: 180,
  },
];

export type Payment = {
  id: string;
  name: string;
  tokenAssigned: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'tokenAssigned',
    header: 'Token Assigned',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('tokenAssigned')}</div>
    ),
  },
];

export function SelectBeneficiaryTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { id, bid } = useParams();
  const route = useRouter();

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
          placeholder="Search Beneficiaries"
          value={(table.getColumn('vendors')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('vendors')?.setFilterValue(event.target.value)
          }
          className="rounded-md"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <ScrollArea className="h-[calc(100vh-520px)]">
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
