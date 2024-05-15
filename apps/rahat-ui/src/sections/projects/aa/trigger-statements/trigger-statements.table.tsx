'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Table, flexRender } from '@tanstack/react-table';
import { Plus, Settings2, Search } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

type IProps = {
  table: Table<any>;
  projectId: string | string[];
  loading: boolean;
};

export default function TriggerStatementsTable({
  table,
  projectId,
  loading,
}: IProps) {
  const router = useRouter();
  if (loading) return <TableLoader />;
  return (
    <>
      <div className="p-2">
        <div className="flex items-center mb-2 gap-4">
          <div className="flex w-full">
            <div className="relative w-full">
              <Search
                size={18}
                strokeWidth={2.5}
                className="absolute left-2 top-3 text-muted-foreground"
              />
              <Input
                placeholder="Search Trigger Statements..."
                value={
                  (table.getColumn('title')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('title')?.setFilterValue(event.target.value)
                }
                className="rounded-l rounded-r-none pl-8"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-l-none">
                  <Settings2 className="mr-2 h-4 w-5" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={() =>
              router.push(`/projects/aa/${projectId}/trigger-statements/add`)
            }
          >
            <Plus size={18} className="mr-1" /> Add Trigger Statement
          </Button>
        </div>
        <div className="rounded border h-[calc(100vh-180px)] bg-card">
          <TableComponent>
            <ScrollArea className="h-table1">
              <TableHeader className="bg-secondary sticky top-0">
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
        </div>
      </div>
    </>
  );
}
