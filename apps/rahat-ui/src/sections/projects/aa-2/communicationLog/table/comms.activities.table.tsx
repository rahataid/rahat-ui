'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useActivitiesHavingComms, usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { UUID } from 'crypto';
import useCommsActivitiesTableColumns from './useCommsActivitesTableColumns';
import { SearchInput } from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';

export default function CommsActivitiesTable() {
  const { id: projectId } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const { activitiesData, activitiesMeta } = useActivitiesHavingComms(
    projectId as UUID,
    { ...pagination, filters },
  );
  const columns = useCommsActivitiesTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: activitiesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue = value === 'ALL' ? '' : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );
  return (
    <div>
      <>
        <div className="flex justify-between gap-2">
          <SearchInput
            name="title"
            className="w-[100%]"
            value={
              (table.getColumn('title')?.getFilterValue() as string) ??
              filters?.title
            }
            onSearch={(event) => handleFilterChange(event)}
          />
          <SelectComponent
            name="Phase"
            options={['ALL', 'ACTIVATION', 'READINESS', 'PREPAREDNESS']}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'phase', value },
              })
            }
            value={filters?.phase || ''}
          />
          <SelectComponent
            name="Status"
            options={[
              'ALL',
              'NOT_STARTED',
              'WORK_IN_PROGRESS',
              'COMPLETED',
              'DELAYED',
            ]}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'status', value },
              })
            }
            value={filters?.status || ''}
          />
        </div>
        <div className="mt-1 bg-card border rounded">
          <Table>
            <ScrollArea className="h-[calc(100vh-430px)]">
              <TableHeader className="sticky top-0">
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
        </div>
      </>
    </div>
  );
}
