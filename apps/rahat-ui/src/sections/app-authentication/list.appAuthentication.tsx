'use client';

import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { usePagination, useRahatSettingList } from '@rahat-ui/query';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '../../utils/useDebouncehooks';
import { useAppAuthenticationColumns } from './useAppAuthenticationColumns';

export default function ListAppAuthentication() {
  const columns = useAppAuthenticationColumns();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [flag, setFlag] = useState('all');
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();

  const debouncedFilters = useDebounce(filters, 500) as any;

  const table = useReactTable({
    manualPagination: true,
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  });

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
    <div className="w-full mt-1 p-1 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Search by name..."
          name="name"
          value={
            (table.getColumn('name')?.getFilterValue() as string) ??
            filters?.name
          }
          onChange={(event) => handleFilterChange(event)}
          className="rounded mr-2"
        />
      </div>

      <div className="rounded border bg-white">
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-190px)]">
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
          {/* <CustomPagination
            meta={data?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={data?.response?.meta.total || 0}
          /> */}
        </TableComponent>
      </div>
    </div>
  );
}
