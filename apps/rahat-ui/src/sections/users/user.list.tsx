'use client';

import * as React from 'react';
import { Table, flexRender } from '@tanstack/react-table';
import { Plus, Settings2 } from 'lucide-react';
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
import { User } from '@rumsan/sdk/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type IProps = {
  table: Table<User>;
};

export default function UsersTable({ table }: IProps) {
  const router = useRouter();

  return (
    <>
      <div className="p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Search User..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded mr-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
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
        <div className="rounded border h-[calc(100vh-180px)] bg-card">
          {table.getRowModel().rows?.length ? (
            <>
              <TableComponent>
                <ScrollArea className="h-table1">
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
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
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
                    ))}
                  </TableBody>
                </ScrollArea>
              </TableComponent>
            </>
          ) : (
            <div className="w-full h-[calc(100vh-140px)]">
              <div className="flex flex-col items-center justify-center">
                <Image
                  src="/noData.png"
                  height={250}
                  width={250}
                  alt="no data"
                />
                <p className="text-medium text-base mb-1">No Data Available</p>
                <p className="text-sm mb-4 text-gray-500">
                  There are no users to display at the moment
                </p>
                <Button onClick={() => router.push(`/users/add`)}>
                  {' '}
                  <Plus className="mr-2" size={20} strokeWidth={1.5} />
                  Add User
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
