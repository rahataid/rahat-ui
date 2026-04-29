import { Table, flexRender } from '@tanstack/react-table';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CircleEllipsisIcon } from 'lucide-react';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

type IProps = {
  table: Table<any>;
  tableHeight?: string;
  loading?: boolean;
};

export default function CambodiaTable({ table, tableHeight, loading }: IProps) {
  return (
    <TableComponent>
      <ScrollArea className={tableHeight ?? 'h-[calc(100vh-340px)]'}>
        <TableHeader className="sticky top-0 bg-card z-0">
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
      </ScrollArea>
    </TableComponent>
  );
}
