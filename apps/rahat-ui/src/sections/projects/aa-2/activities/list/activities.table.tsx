import { Table, flexRender } from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult } from 'apps/rahat-ui/src/common';

type IProps = {
  table: Table<any>;
  tableheight?: string;
};

export default function ActivitiesTable({ table, tableheight }: IProps) {
  return (
    <ScrollArea className={`${tableheight ?? 'h-[calc(100vh-390px)]'}`}>
      <TableComponent>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="sticky top-0 bg-card">
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
                <NoResult message="No Activities Available" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
