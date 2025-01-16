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
import Image from 'next/image';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { DataTablePagination } from '../transactions/dataTablePagination';

const GrievanceTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowDetails, setRowDetails] = React.useState();

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
  } = usePagination();

  const grievanceList = useGrievanceList({
    page: pagination.page,
    perPage: pagination.perPage,
    sort: 'createdAt',
    order: 'asc',
    ...filters,
  });
  const { id } = useParams();
  const route = useRouter();
  const columns = useGrievanceTableColumns({
    data: grievanceList.data?.data,
    rowDetails,
    setRowDetails,
  });

  const meta = grievanceList.data?.response?.meta;
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
          <Input
            placeholder="Search grievance..."
            value={filters['title']}
            onChange={(event) => {
              setFilters((prev) => ({ ...prev, title: event.target.value }));
            }}
            className="max-w-sm rounded mr-2"
          />
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
                {grievanceList.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <TableLoader />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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
                      <div className="w-full h-[calc(100vh-140px)]">
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
                            There are no grievances to display at the moment.
                          </p>
                          <Button
                            className="flex items-center gap-2"
                            onClick={() =>
                              route.push(`/projects/c2c/${id}/grievance/add`)
                            }
                          >
                            <Plus size={20} strokeWidth={1.75} />
                            Add Grievance
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
      </div>
      {/* <DataTablePagination table={table} /> */}

      <CustomPagination
        meta={meta}
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePageSizeChange={setPerPage}
        handlePrevPage={setPrevPage}
        perPage={pagination.perPage}
      />
    </>
  );
};

export default GrievanceTable;
