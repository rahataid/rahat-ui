import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import React from 'react';
import {
  CustomPagination,
  NoResult,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';
const { WORK_IN_PROGRESS, COMPLETED, DELAYED, PENDING, ALL } = ACTIVITY_STATUS;
const statusList = [WORK_IN_PROGRESS, COMPLETED, DELAYED, PENDING, ALL];

interface ReusableLogsTableProps<T> {
  data: T[];
  columns: any;
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
  pagination: any;
  setPagination: (pagination: any) => void;
  isLoading: boolean;
  meta: any;
}

export default function CommonLogsTable<T>({
  data,
  columns,
  filters,
  setFilters,
  pagination,
  setPagination,
  isLoading,
  meta,
}: ReusableLogsTableProps<T>) {
  const table = useReactTable({
    manualPagination: true,
    data: data || [],
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

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <SearchInput
          name="title"
          placeholder="Search Title..."
          className="w-[100%]"
          value={filters.communication_title}
          onSearch={(event) => handleFilterChange(event)}
        />
        <SearchInput
          name="group_name"
          placeholder="Search Group Name..."
          className="w-[100%]"
          value={filters.groupName}
          onSearch={(event) => handleFilterChange(event)}
        />
        <SelectComponent
          name="Group Type"
          options={['BENEFICIARY', 'STAKEHOLDERS', 'ALL']}
          onChange={(value) =>
            handleFilterChange({
              target: { name: 'group_type', value },
            })
          }
          value={filters?.group_type || ''}
        />

        <SelectComponent
          name="status"
          options={statusList}
          onChange={(value) =>
            handleFilterChange({
              target: { name: 'sessionStatus', value },
            })
          }
          value={filters?.sessionStatus || ''}
        />
      </div>
      <div className=" border-gray-100 overflow-hidden rounded-lg border ">
        <ScrollArea className="h-[calc(100vh-390px)]">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
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
                    {isLoading ? <SpinnerLoader /> : <NoResult />}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <CustomPagination
          meta={
            meta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={() =>
            setPagination({ ...pagination, page: pagination.page + 1 })
          }
          handlePrevPage={() =>
            setPagination({ ...pagination, page: pagination.page - 1 })
          }
          handlePageSizeChange={(value) =>
            setPagination({ ...pagination, perPage: Number(value), page: 1 })
          }
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={meta?.total || 0}
        />
      </div>
    </>
  );
}
