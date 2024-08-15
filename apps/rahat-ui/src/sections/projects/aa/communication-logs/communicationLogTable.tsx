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

export default function CommunicationLogTable() {
  const { id: projectId } = useParams();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const { activitiesData, activitiesMeta } = useActivitiesHavingComms(
    projectId as UUID,
    {},
  );

  const columns = useCommsActivitiesTableColumns();

  const table = useReactTable({
    data: activitiesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <>
        <div className="flex justify-between gap-2">
          <Input
            placeholder="Search title"
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('title')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="mt-1 bg-card border rounded">
          <Table>
            <ScrollArea className="h-[calc(100vh-374px)]">
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
