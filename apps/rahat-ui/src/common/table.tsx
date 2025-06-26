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
};

export function DemoTable({ table, tableHeight, loading }: IProps) {
  console.log(table.getHeaderGroups(), 'xxx');
  return (
    <ScrollArea className={tableHeight ?? 'h-[calc(100vh-340px)]'}>
      <TableComponent>
        <TableHeader className="sticky top-0 bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => {
                console.log('header.id', i, header.id);
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
                {loading ? <SpinnerLoader /> : <NoResult />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
    </ScrollArea>
  );
}
