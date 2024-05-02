'use client';

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

import { GroupResponseById } from '@rahataid/community-tool-sdk/groups';

type IProps = {
  table: Table<GroupResponseById[]>;
};

export default function GroupDetailTable({ table }: IProps) {
  return (
    <>
      <div className="w-full -mt-0 bg-secondary">
        <div className="rounded border bg-card">
          <TableComponent>
            <ScrollArea className="h-[calc(100vh-210px)]">
              <TableHeader className="bg-card sticky top-0">
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <TableRow key={index}>
                    {headerGroup.headers.map((header, index) => {
                      return (
                        <TableHead key={index}>
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
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={index}
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </TableComponent>
        </div>
      </div>
    </>
  );
}
