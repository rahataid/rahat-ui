'use client';

import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { flexRender, Table } from '@tanstack/react-table';
import { NoResult, SpinnerLoader } from 'apps/rahat-ui/src/common';

export default function CommsLogsTable({
  table,
  isLoading,
}: {
  table: Table<any>;
  isLoading?: boolean;
}) {
  return (
    <>
      <div className="mt-1">
        <TableComponent>
          <ScrollArea className="h-[calc(400px)]">
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
                    {isLoading ? <SpinnerLoader /> : <NoResult />}
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
