import React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import { TableLoader } from './table.loader';
import { NoResult } from './noResults';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import { SpinnerLoader } from './spinner.loader';

type IProps = {
  table: Table<any>;
  tableHeight?: string;
  loading?: boolean;
  message?: string;
};

export function DemoTable({ table, tableHeight, loading, message }: IProps) {
  return (
    <ScrollArea className={tableHeight ?? 'h-[calc(100vh-340px)]'}>
      <TableComponent>
        <TableHeader className="sticky top-0 bg-gray-100">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                {loading ? <SpinnerLoader /> : <NoResult message={message} />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
    </ScrollArea>
  );
}
