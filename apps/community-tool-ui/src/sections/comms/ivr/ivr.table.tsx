'use client';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Mail,
  MessageCircle,
  PhoneCall,
  Settings,
  Settings2,
} from 'lucide-react';

import Image from 'next/image';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useIvrTableColumn from './useIvrTableColumn';
import { Input } from '@rahat-ui/shadcn/components/input';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Button } from '@rahat-ui/shadcn/components/button';

export type Ivr = {
  id: number;
  to: string;
  date: string;
  duration: string;
  status: string;
};

export default function IvrTable() {
  const columns = useIvrTableColumn();
  const { id } = useParams();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const dataArray = [
    { to: '9842349411', date: '2023-06-01', status: 'Rejected' },
    { to: '9852227472', date: '2023-06-02', status: 'Approved' },
    { to: '9866180303', date: '2023-06-03', status: 'Pending' },
    { to: '9865079182', date: '2023-06-04', status: 'Pending' },
    { to: '9852711445', date: '2023-06-05', status: 'Approved' },
    { to: '9866587402', date: '2023-06-06', status: 'Rejected' },
    { to: '9853257921', date: '2023-06-07', status: 'Approved' },
    { to: '9860855697', date: '2023-06-08', status: 'Approved' },
    { to: '9854869214', date: '2023-06-09', status: 'Pending' },
    { to: '9857289679', date: '2023-06-10', status: 'Rejected' },
  ] as any;
  const table = useReactTable({
    data: dataArray,
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
    <div className="w-full h-full p-2 bg-secondary">
      <div className=" grid sm:grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <DataCard
          className=""
          title="Voice"
          // number={totalVoiceMessage.toString()}
          number={'16'}
          Icon={PhoneCall}
        />
        <DataCard
          className=""
          title="Beneficiaries"
          number={'240'}
          // number={totalBeneficiary.toString()}
          Icon={Mail}
        />
        <DataCard
          className=""
          title="Successful Calls"
          number={'25'}
          // number={deliveredVoiceMessage.toString()}
          Icon={MessageCircle}
        />
      </div>
      <div className="flex items-center mt-4 mb-2 gap-2">
        <Input
          placeholder="Filter communication..."
          value={(table.getColumn('to')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('to')?.setFilterValue(event.target.value)
          }
          className="max-w-mx"
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
        {table.getRowModel().rows?.length > 0 ? (
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              router.push(`/communications/ivr/manage`);
            }}
          >
            <Settings size={18} strokeWidth={1.5} />
            Manage
          </Button>
        ) : null}
      </div>
      <div className="rounded border bg-card">
        {table.getRowModel().rows?.length ? (
          <>
            <Table>
              <ScrollArea className="w-full h-[calc(100vh-320px)]">
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
                        {isFetching && (
                          <div className="flex items-center justify-center space-x-2 h-full">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </ScrollArea>
            </Table>
            <div className="flex items-center justify-end space-x-2 p-2 border-t bg-card">
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
          <div className="w-full h-[calc(100vh-310px)]">
            <div className="flex flex-col items-center justify-center">
              <Image src="/noData.png" height={250} width={250} alt="no data" />
              <p className="text-medium text-base mb-1">No Data Available</p>
              <p className="text-sm mb-4 text-gray-500">
                There are no logs at the moment.
              </p>
              <Button
                className="flex items-center gap-3"
                onClick={() => router.push(`/communications/ivr/manage`)}
              >
                <Settings size={18} strokeWidth={1.5} />
                Manage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
