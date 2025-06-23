'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { CircleEllipsisIcon, Settings2 } from 'lucide-react';

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
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Pagination } from '@rumsan/sdk/types';
import { TempBeneficiary } from '@rahataid/sdk';
import Image from 'next/image';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
type IProps = {
  table: Table<TempBeneficiary>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
  setPagination: (pagination: Pagination) => void;
  pagination: Pagination;
  loading?: boolean;
};

export default function GroupListView({
  table,
  filters,
  setFilters,
  setPagination,
  pagination,
  loading,
}: IProps) {
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  return (
    <>
      <div className="p-2">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Search Group Name..."
            name="groupName"
            value={
              (table.getColumn('groupName')?.getFilterValue() as string) ??
              filters?.groupName
            }
            onChange={(event) => handleFilterChange(event)}
            className="rounded  w-full"
          />
        </div>
        {/* <div className="rounded border "> */}

        <>
          <TableComponent>
            <ScrollArea className="h-[570px] bg-card ">
              <TableHeader>
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
                      {loading ? (
                        <div className="flex items-center justify-center mt-4">
                          <div className="text-center">
                            <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
                            <Label className="text-base">Loading ...</Label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-[480px]">
                          <div className="flex flex-col items-center justify-center">
                            <Image
                              src="/noData.png"
                              height={250}
                              width={250}
                              alt="no data"
                            />
                            <p className="text-medium text-base mb-1">
                              No Data Available
                            </p>
                            <p className="text-sm mb-4 text-gray-500">
                              There are no community beneficiaries to display at
                              the moment
                            </p>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </TableComponent>
        </>
      </div>
      {/* </div> */}
    </>
  );
}
