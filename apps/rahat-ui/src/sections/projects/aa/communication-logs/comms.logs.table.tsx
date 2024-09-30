'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Table,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import ClientSidePagination from '../../components/client.side.pagination';

export default function CommsLogsTable({ table }: {
  table: Table<any>
}) {

  return (
    <>
      <div className="mt-4 bg-card border rounded">
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-450px)]">
            <TableHeader className="top-0 sticky bg-gray-100">
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </TableComponent>
        {/* <ClientSidePagination table={table} /> */}
      </div>
    </>
  );
}
