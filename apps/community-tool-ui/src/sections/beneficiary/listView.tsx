'use client';
import { Table, flexRender } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

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
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
import { ChangeEvent, useEffect, useState } from 'react';
import { debounce, useDebounce } from '../../utils/debounceHooks';

type IProps = {
  handleClick: (item: ListBeneficiary) => void;
  table: Table<ListBeneficiary>;
  setFilters: (fiters: Record<string, any>) => void;
  filters: Record<string, any>;
};

export default function ListView({
  handleClick,
  table,
  setFilters,
  filters,
}: IProps) {
  // const [filter, setFilter] = useState<{ [key: string]: string }>({});

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      console.log(name);
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  // ** toDo: need to refactor for the debounce effect**

  // const debouncedFilters = useDebounce(filter, 300);

  // const handleFilterChange = (event: any) => {
  //   if (event && event.target) {
  //     const { name, value } = event.target;
  //     table.getColumn(name)?.setFilterValue(value);
  //     setFilter({
  //       ...filter,
  //       [name]: value,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   setFilters(debouncedFilters);
  // }, [debouncedFilters, setFilters]);

  // console.log(debouncedFilters);

  return (
    <>
      <div className="w-full -mt-2 p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Search beneficiary by nickName..."
            name="nickName"
            value={
              (table.getColumn('nickName')?.getFilterValue() as string) ??
              filters?.nickName
            }
            onChange={(event) => handleFilterChange(event)}
            className="rounded mr-2"
          />

          <Input
            placeholder="Search beneficiary by location..."
            name="location"
            value={
              (table.getColumn('location')?.getFilterValue() as string) ??
              filters?.location
            }
            onChange={(event) => handleFilterChange(event)}
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
