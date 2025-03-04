import React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'libs/shadcn/src/components/ui/table';
import { ScrollArea } from 'libs/shadcn/src/components/ui/scroll-area';
import { TableLoader } from './table.loader';
import NoResult from './noResults';

type IProps = {
  table: Table<any>;
  tableHeight?: string;
  loading?: boolean;
};

export function DemoTable({ table, tableHeight, loading }: IProps) {
  return (
    <ScrollArea className={tableHeight ?? 'h-[calc(100vh-340px)]'}>
      {loading ? (
        <TableLoader />
      ) : (
        <TableComponent>
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
                  <NoResult />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      )}
    </ScrollArea>
  );
}
