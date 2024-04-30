'use client';
import { Table, flexRender } from '@tanstack/react-table';
import { CircleEllipsisIcon } from 'lucide-react';

import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ListBeneficiary } from '@rahataid/community-tool-sdk';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PinIcon } from 'lucide-react';

type IProps = {
  handleClick: (item: ListBeneficiary) => void;
  table: Table<ListBeneficiary>;
  loading: boolean;
};

export default function ListView({ handleClick, table, loading }: IProps) {
  return (
    <>
      <div className="w-full -mt-2 p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Enter suitable name to save found result..."
            name="pinName"
            className="rounded mr-2"
          />

          <Button className="rounded" name="location" type="button">
            <PinIcon className="h-6 w-6 mr-2" />
            Save Result
          </Button>
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
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      <div style={{ marginLeft: '48%' }}>
                        <CircleEllipsisIcon className="animate-spin h-8 w-8" />
                      </div>
                      Searching data...
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
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
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </ScrollArea>
          </TableComponent>
        </div>
      </div>
    </>
  );
}
