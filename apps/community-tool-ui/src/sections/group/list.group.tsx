'use client';

import React from 'react';
import { Table, flexRender } from '@tanstack/react-table';

import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

import { ListGroup } from '@rahataid/community-tool-sdk/groups';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

type IProps = {
  handleClick: (index: any) => void;
  table: Table<ListGroup>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
};

export default function GroupList({
  table,
  handleClick,
  setFilters,
  filters,
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
  };

  return (
    <div className="w-full -mt-2 p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter group..."
          name="name"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => handleFilterChange(event)}
          className="rounded mr-2"
        />
      </div>
      <div className="rounded border bg-card">
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-180px)]">
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      handleClick(row.original);
                    }}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </TableComponent>
      </div>
    </div>
  );
}
