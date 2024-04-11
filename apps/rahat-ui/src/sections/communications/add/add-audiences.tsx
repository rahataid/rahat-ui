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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useCreateAudience } from '@rumsan/communication-query';

import { flexRender } from '@tanstack/react-table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import React, { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useAudienceColumns } from './use-audience-columns';
import { useAudienceTable } from './use-audience-table';

type AddAudienceProps = {
  form: UseFormReturn<z.infer<any>>;

  globalFilter: any;
  setGlobalFilter: any;
  selectedRows: Array<any>;
  audienceData: any;
  setSelectedRows: any;
};

const AddAudience: FC<AddAudienceProps> = ({
  form,
  globalFilter,
  setGlobalFilter,
  selectedRows,
  audienceData,
  setSelectedRows,
}) => {
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const projectsList = useProjectList({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { data: beneficiaryData } = useBeneficiaryPii({
    ...pagination,
    ...filters,
  });
  const createAudience = useCreateAudience();

  const filterBenByAudience = React.useCallback(
    (id: string) => {
      if (id !== 'ALL') {
        setFilters({ ...filters, projectId: id });
        return;
      }
      setFilters({ ...filters, projectId: undefined });
    },
    [filters, setFilters],
  );
  const columns = useAudienceColumns(
    beneficiaryData,
    selectedRows,
    audienceData,
    createAudience,
    setSelectedRows,
  );

  const tableData = React.useMemo(() => {
    return (
      beneficiaryData &&
      beneficiaryData?.data?.map((item: any) => ({
        name: item?.name,
        id: item?.beneficiaryId,
        phone: item?.phone,
      }))
    );
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
        <Select onValueChange={filterBenByAudience}>
          <SelectTrigger className="max-w-32">
            <SelectValue placeholder="Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'ALL'}>ALL</SelectItem>
            {projectsList.data?.data.length &&
              projectsList.data.data.map((project) => {
                return (
                  <SelectItem key={project.uuid} value={project.uuid || ''}>
                    {project.name}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
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
            <div className="rounded border mb-2 bg-card">
              <Table>
                <ScrollArea className="h-[calc(100vh-376px)]">
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
              <CustomPagination
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
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddAudience;
