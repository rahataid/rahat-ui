'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import useActivitiesTableColumn from './useActivitiesTableColumn';
import {
  useActivities,
  useActivitiesCategories,
  useActivitiesHazardTypes,
  useActivitiesPhase,
  useActivitiesStore,
  usePagination,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useEffect, useState, useCallback } from 'react';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

export default function ActivitiesTable() {
  const { id } = useParams();

  const {
    pagination,
    // selectedListItems,
    // setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const { activitiesData, activitiesMeta, isLoading } = useActivities(
    id as UUID,
    { ...pagination, ...filters },
  );

  console.log('activitiesData', activitiesData);

  useActivitiesCategories(id as UUID);
  const categories = useActivitiesStore((state) => state.categories);
  useActivitiesHazardTypes(id as UUID);
  const hazardTypes = useActivitiesStore((state) => state.hazardTypes);
  useActivitiesPhase(id as UUID);
  const phases = useActivitiesStore((state) => state.phases);

  const columns = useActivitiesTableColumn();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    manualPagination: true,
    data: activitiesData ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleCategoryFilters = useCallback(
    (category: any) => {
      if (category === 'all') {
        setFilters({ ...filters, category: null });
        return;
      }
      setFilters({ ...filters, category });
    },
    [filters, setFilters],
  );

  const handleHazardTypeFilter = useCallback(
    (hazardType: any) => {
      setFilters({ ...filters, hazardType });
    },
    [filters, setFilters],
  );

  const handlePhasesFilter = useCallback(
    (phase: any) => {
      if (phase === 'all') {
        setFilters({ ...filters, phase: null });
        return;
      }
      setFilters({ ...filters, phase });
    },
    [filters, setFilters],
  );

  if (isLoading) {
    return <TableLoader />;
  }

  return (
    <div className="p-2 bg-secondary">
      <div className="flex items-center gap-2 mb-2 w-1/2">
        {/* Filter Phases */}
        <Select onValueChange={(value) => handlePhasesFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Phases</SelectItem>
              {phases.map((item) => (
                <SelectItem key={item.id} value={item.uuid}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Filter Category */}
        <Select onValueChange={(value) => handleCategoryFilters(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item.id} value={item.uuid}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Filter Hazard type */}
        <Select onValueChange={(value) => handleHazardTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a hazard type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {hazardTypes.map((item) => (
                <SelectItem key={item.id} value={item.uuid}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded border bg-card h-[calc(100vh-178px)]">
        <Table>
          <ScrollArea className="h-[calc(100vh-193px)]">
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <CustomPagination
        meta={
          activitiesMeta || {
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }
        }
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={activitiesMeta?.lastPage || 0}
      />
      {/* <div className="flex items-center justify-end space-x-8 p-2 pb-0">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Rows per page</div>
          <Select
            defaultValue="10"
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
