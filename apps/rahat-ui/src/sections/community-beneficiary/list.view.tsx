'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { CircleEllipsisIcon, Settings2 } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Pagination } from '@rumsan/sdk/types';
import { Label } from '@radix-ui/react-label';
type IProps = {
  table: Table<any>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
  setPagination: (pagination: Pagination) => void;
  pagination: Pagination;
  loading: boolean;
};

export default function ListView({
  table,
  filters,
  setFilters,
  setPagination,
  pagination,
  loading,
}: IProps) {
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  return (
    <>
      <div className="-mt-2 p-2">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filters by first name..."
            name="firstName"
            value={
              (table.getColumn('firstName')?.getFilterValue() as string) ??
              filters?.firstName
            }
            onChange={(event) => handleFilterChange(event)}
            className="rounded"
          />
        </div>
        {/* <div className="rounded border bg-card h-[calc(100vh-180px)]"> */}
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-500px)] bg-card ">
            <TableHeader className="sticky top-0 bg-card">
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
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center mt-4">
                        <div className="text-center">
                          <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
                          <Label className="text-base">Loading ...</Label>
                        </div>
                      </div>
                    ) : (
                      'No result found'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </TableComponent>
      </div>
      {/* </div> */}
    </>
  );
}
