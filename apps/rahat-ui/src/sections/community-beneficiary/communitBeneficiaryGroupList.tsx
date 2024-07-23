'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

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
import { TempBeneficiary } from '@rahataid/sdk';
import Image from 'next/image';
type IProps = {
  table: Table<TempBeneficiary>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
  setPagination: (pagination: Pagination) => void;
  pagination: Pagination;
};

export default function GroupListView({
  table,
  filters,
  setFilters,
  setPagination,
  pagination,
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
      <div className="-mt-2 p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filters by group Name..."
            name="groupName"
            value={
              (table.getColumn('groupName')?.getFilterValue() as string) ??
              filters?.groupName
            }
            onChange={(event) => handleFilterChange(event)}
            className="rounded mr-2"
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
        </div>
        <div className="rounded border h-[calc(100vh-180px)] bg-card">
          {table.getRowModel().rows?.length ? (
            <>
              <TableComponent>
                <ScrollArea className="h-table1">
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
              </TableComponent>
            </>
          ) : (
            <div className="w-full h-[calc(100vh-140px)]">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/noData.png"
                  height={250}
                  width={250}
                  alt="no data"
                />
                <p className="text-medium text-base mb-1">No Data Available</p>
                <p className="text-sm mb-4 text-gray-500">
                  There are no community beneficiaries to display at the moment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
