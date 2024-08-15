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
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export type Payment = {
  id: number;
  name: string;
  tokenAssigned: number;
};

export function SelectBeneficiaryTable({
  form,
  disbursmentList,
}: {
  form: UseFormReturn<z.infer<any>>;
  disbursmentList: any;
}) {
  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.getFilteredRowModel().rows.map((row) => {
              if (value) {
                const disbursements = form.getValues('disbursements') || [];
                const isUnique = disbursements.includes(row.original.id);
                if (!isUnique)
                  form.setValue('disbursements', [
                    ...disbursements,
                    row.original.id,
                  ]);
              } else {
                const disbursements = form.getValues('disbursements') || [];
                const filteredValue = disbursements.filter(
                  (id: number) => id !== row.original.id,
                );
                form.setValue('disbursements', filteredValue);
              }
            });
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (value) {
              const disbursements = form.getValues('disbursements') || [];
              form.setValue('disbursements', [
                ...disbursements,
                row.original.id,
              ]);
            } else {
              const disbursements = form.getValues('disbursements') || [];
              const filteredValue = disbursements.filter(
                (id: number) => id !== row.original.id,
              );
              form.setValue('disbursements', filteredValue);
            }

            return row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'tokenAssigned',
      header: 'Token Assigned',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('tokenAssigned')}</div>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const tableData = React.useMemo(() => {
    if (disbursmentList) {
      console.log(disbursmentList);
      const mappedData = disbursmentList?.map((disbursment: any) => ({
        name: disbursment?.Beneficiary?.name || 'Rajesh hamal',
        tokenAssigned: disbursment?.amount,
        id: disbursment?.id,
      }));
      return mappedData;
    } else {
      return [];
    }
  }, [disbursmentList]);

  const table = useReactTable({
    data: tableData,
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
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="rounded-md"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <ScrollArea className="h-[calc(100vh-638px)]">
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
