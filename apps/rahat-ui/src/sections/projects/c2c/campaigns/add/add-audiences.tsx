'use client';

import {
  useBeneficiaryPii,
  usePagination,
  useProjectList,
} from '@rahat-ui/query';
import {
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { flexRender } from '@tanstack/react-table';
import React, { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useAudienceColumns } from './use-audience-columns';
import { useAudienceTable } from './use-audience-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

type AddAudienceProps = {
  form: UseFormReturn<z.infer<any>>;

  globalFilter: any;
  setGlobalFilter: any;
  selectedRows: Array<any>;
  setSelectedRows: any;
};

const AddAudience: FC<AddAudienceProps> = ({
  form,
  globalFilter,
  setGlobalFilter,
  selectedRows,
  setSelectedRows,
}) => {
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { id } = useParams() as { id: UUID };
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { data: beneficiaryData } = useBeneficiaryPii({
    projectId: id,
  });

  const columns = useAudienceColumns(
    beneficiaryData,
    selectedRows,
    setSelectedRows,
  );

  const tableData = React.useMemo(() => {
    if (beneficiaryData)
      return (
        beneficiaryData &&
        beneficiaryData?.data?.map((item: any) => ({
          name: item?.piiData?.name,
          id: item?.piiData?.beneficiaryId,
          phone: item?.piiData?.phone,
          email: item?.piiData?.email,
        }))
      );
    else return [];
  }, [beneficiaryData]);

  const table = useAudienceTable({
    columnVisibility,
    columns,
    globalFilter,
    rowSelection,
    setColumnVisibility,
    setGlobalFilter,
    setRowSelection,
    tableData,
  });

  return (
    <>
      {/* header area start  */}
      <div className="flex items-center gap-2 pb-2">
        <Input
          placeholder="Filter audiences"
          value={globalFilter ?? ''}
          onChange={(value) => {
            setGlobalFilter(value.target.value);
          }}
          className="max-w-sm"
        />

        <div
          className={`border rounded px-3 py-2 h-10 text-sm ${
            selectedRows.length
              ? 'bg-primary text-white font-medium'
              : 'bg-card'
          }`}
        >
          {selectedRows.length} - Audience selected
        </div>
      </div>
      {/* header area end  */}
      <FormField
        control={form.control}
        name="audiences"
        render={() => (
          <FormItem>
            <div className="rounded border mb-8 bg-card">
              <Table>
                <ScrollArea className="h-[calc(100vh-440px)]">
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
                      table.getRowModel()?.rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row?.getIsSelected() && 'selected'}
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
            <FormMessage />
          </FormItem>
        )}
      />
      {/* <CustomPagination
        meta={
          beneficiaryData?.response?.meta || {
            total: 0,
            currentPage: 0,
          }
        }
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={beneficiaryData?.response?.meta?.lastPage || 0}
      /> */}
      <div className="flex items-center justify-end space-x-8 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
                <SelectItem value="1">1</SelectItem>
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
      </div>
    </>
  );
};

export default AddAudience;
