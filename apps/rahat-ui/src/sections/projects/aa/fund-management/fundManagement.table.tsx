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
import { ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import * as React from 'react';
import AddButton from '../../components/add.btn';
import { useParams, useRouter } from 'next/navigation';

const data: FundManagement[] = [
  {
    id: '1',
    title: 'Testing Title',
    tokenvalue: 50,
    noOfToken: 100,
    fundAssigned: 5000,
    beneficiaryGroup: 'Group A',
  },
  {
    id: '2',
    title: 'Testing Title',
    tokenvalue: 75,
    noOfToken: 150,
    fundAssigned: 11250,
    beneficiaryGroup: 'Group B',
  },
  {
    id: '3',
    title: 'Testing Title',
    tokenvalue: 60,
    noOfToken: 200,
    fundAssigned: 12000,
    beneficiaryGroup: 'Group C',
  },
  {
    id: '4',
    title: 'Testing Title',
    tokenvalue: 55,
    noOfToken: 180,
    fundAssigned: 9900,
    beneficiaryGroup: 'Group D',
  },
  {
    id: '5',
    title: 'Testing Title',
    tokenvalue: 80,
    noOfToken: 125,
    fundAssigned: 10000,
    beneficiaryGroup: 'Group E',
  },
  {
    id: '6',
    title: 'Testing Title',
    tokenvalue: 90,
    noOfToken: 110,
    fundAssigned: 9900,
    beneficiaryGroup: 'Group F',
  },
];

export type FundManagement = {
  id: string;
  title: string;
  tokenvalue: number;
  noOfToken: number;
  fundAssigned: number;
  beneficiaryGroup: string;
};

export const columns: ColumnDef<FundManagement>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'tokenvalue',
    header: 'Token Value',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('tokenvalue')}</div>
    ),
  },
  {
    accessorKey: 'noOfToken',
    header: 'No Of Token',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('noOfToken')}</div>
    ),
  },
  {
    accessorKey: 'fundAssigned',
    header: 'Fund Assigned',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('fundAssigned')}</div>
    ),
  },
  {
    accessorKey: 'beneficiaryGroup',
    header: 'Beneficiary Group',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('beneficiaryGroup')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-evenly">
          <Eye
            className="cursor-pointer"
            // onClick={() => router.push(`projects/aa/${pid}/fund-management/1`)}
            size={20}
            strokeWidth={1.25}
          />
          <Pencil
            className="text-blue-600 cursor-pointer"
            size={20}
            strokeWidth={1.25}
          />
          <Trash2
            className="text-red-600 cursor-pointer"
            size={20}
            strokeWidth={1.25}
          />
        </div>
      );
    },
  },
];

export function FundManagementTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const pid = useParams();

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
    <div className="p-2 bg-secondary">
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Search Fund Management..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-full"
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
        <AddButton
          name="Add Fund Management"
          path={`/projects/aa/${pid.id}/fund-management/add`}
        />
      </div>
      <div className="rounded border bg-card">
        <Table>
          <ScrollArea className="h-[calc(100vh-182px)]">
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
