'use client';
import * as React from 'react';

import { useGrievanceList, usePagination } from '@rahat-ui/query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useGrievanceTableColumns } from './useGrievanceColumn';

import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

const GrievanceTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const grievanceList = useGrievanceList({
    page: 1,
    perPage: 20,
    sort: 'createdAt',
    order: 'asc',
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();
  const selectedRowAddresses = Object.keys(selectedListItems);
  const columns = useGrievanceTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: grievanceList.data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.uuid,
    onRowSelectionChange: setSelectedListItems,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <>
      <div className="p-2 bg-secondary">
        <div className="flex justify-between items-center mb-2">
          <div className="flex">
            <Input
              placeholder="Search grievance..."
              value={
                (table.getColumn('reporter')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) => {
                table.getColumn('reporter')?.setFilterValue(event.target.value);
              }}
              className="max-w-sm rounded mr-2"
            />
          </div>
        </div>
        <div className="rounded border bg-card">
          <Table>
            <ScrollArea className="h-[calc(100vh-182px)]">
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {
                        //   projectBeneficiaries.isFetching
                        grievanceList.isLoading ? (
                          <TableLoader />
                        ) : (
                          'No data available.'
                        )
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePageSizeChange={setPerPage}
        handlePrevPage={setPrevPage}
        // meta={projectBeneficiaries?.data?.response?.meta || {}}
        perPage={pagination.perPage}
      />
    </>
  );
};

export default GrievanceTable;
