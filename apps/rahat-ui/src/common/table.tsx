import React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import { NoResult } from './noResults';
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
  height?: string;
  fixedLayout?: boolean;
};

type ColumnMeta = {
  className?: string;
};

export function DemoTable({
  table,
  tableHeight,
  loading,
  message,
  height = '340px',
  fixedLayout = true,
}: IProps) {
  const hasRows = table.getRowModel().rows?.length > 0;
  const containerClass = tableHeight ?? `h-[max(280px,calc(100vh-${height}))]`;

  return (
    <div className={`overflow-auto ${containerClass}`}>
      <TableComponent className={`w-full ${fixedLayout ? 'table-fixed' : 'table-auto'}`}>
        <TableHeader className="sticky top-0 z-10 border-b [&_th]:bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={(header.column.columnDef.meta as ColumnMeta | undefined)?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                <SpinnerLoader />
              </TableCell>
            </TableRow>
          ) : hasRows ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={(cell.column.columnDef.meta as ColumnMeta | undefined)?.className}
                  >
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
                <NoResult message={message} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
    </div>
  );
}
