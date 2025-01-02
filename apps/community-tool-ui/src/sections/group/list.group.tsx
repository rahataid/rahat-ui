'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { useEffect } from 'react';

import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

import { Label } from '@radix-ui/react-label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import { Pagination } from '@rumsan/sdk/types';
import { CircleEllipsisIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

type IProps = {
  table: Table<ListGroup>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
  setPagination: (pagination: Pagination) => void;
  pagination: Pagination;
  loading: boolean;
};

export default function GroupList({
  table,
  filters,
  setFilters,
  setPagination,
  pagination,
  loading,
}: IProps) {
  const pathName = usePathname();
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

  useEffect(() => {
    setFilters({
      name: '',
    });
  }, [pathName, setFilters]);

  return (
    <div className="w-full -mt-2 p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Search by name..."
          name="name"
          value={
            (table.getColumn('name')?.getFilterValue() as string) ??
            filters?.name
          }
          onChange={(event) => handleFilterChange(event)}
          className="rounded mr-2"
        />
      </div>
      <div className="rounded border bg-card">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <TableComponent>
            <TableHeader className="bg-card sticky top-0">
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
                table.getRowModel().rows.map((row, key) => (
                  <TableRow
                    key={key}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={index}>
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
          </TableComponent>
        </ScrollArea>
      </div>
    </div>
  );
}
