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
import { useCreateAudience } from '@rumsan/communication-query';

import { flexRender } from '@tanstack/react-table';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import React, { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { benType } from '../../projects/el/beneficiary/beneficiary.table';
import { useAudienceColumns } from './use-audience-columns';
import { useAudienceTable } from './use-audience-table';
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';

type AddAudienceProps = {
  form: UseFormReturn<z.infer<any>>;

  globalFilter: any;
  setGlobalFilter: any;
  selectedRows: Array<any>;
  audienceData: any;
  setSelectedRows: any;
  audienceRequiredError: boolean;
  setAudienceRequiredError: any;
};

const AddAudience: FC<AddAudienceProps> = ({
  form,
  globalFilter,
  setGlobalFilter,
  selectedRows,
  audienceData,
  setSelectedRows,
  audienceRequiredError,
  setAudienceRequiredError,
}) => {
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const projectsList = useProjectList({});

  const { filters, setFilters } = usePagination();

  const { data: beneficiaryData, isLoading } = useBeneficiaryPii({
    ...filters,
  });
  const createAudience = useCreateAudience();

  const filterBenByProjectId = (id: any) => {
    if (id !== 'ALL') {
      setFilters({ ...filters, projectId: id });
      return;
    }
    setFilters({ ...filters, projectId: undefined });
  };

  const handleDateChange = (date: Date, type: string) => {
    if (type === 'start') {
      setFilters({
        ...filters,
        startDate: date,
      });
    } else {
      setFilters({
        ...filters,
        endDate: date,
      });
    }
  };

  const filterBenByBenTypes = React.useCallback(
    (type: string) => {
      if (type !== 'ALL') {
        setFilters({ ...filters, type });
        return;
      } else {
        const { type: _, ...restFilters } = filters;
        setFilters(restFilters);
      }
    },
    [filters, setFilters],
  );

  console.log(filters);

  const columns = useAudienceColumns(
    beneficiaryData,
    selectedRows,
    audienceData,
    createAudience,
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
          url: item?.Beneficiary?.qrUrl,
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

  if (selectedRows.length > 0) {
    setAudienceRequiredError(false);
  }

  const project = projectsList?.data?.data.find((item) => item.type === 'el');
  const elUuid = project ? project.uuid : null;

  return (
    <>
      {audienceRequiredError && (
        <h3 className="text-red-600">Select Audience</h3>
      )}
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
        {filters.projectId && (
          <>
            <DatePicker
              placeholder="Pick Start Date"
              handleDateChange={handleDateChange}
              type="start"
            />
            <DatePicker
              placeholder="Pick End Date"
              handleDateChange={handleDateChange}
              type="end"
            />
          </>
        )}
        <Select onValueChange={filterBenByProjectId}>
          <SelectTrigger className="max-w-32">
            <SelectValue placeholder="Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'ALL'}>ALL</SelectItem>
            {projectsList.data?.data.length &&
              projectsList.data.data.map((project) => {
                return (
                  <SelectItem key={project.uuid} value={project.uuid || ''}>
                    {project?.name}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
        {filters?.projectId === elUuid && (
          <Select onValueChange={filterBenByBenTypes}>
            <SelectTrigger className="max-w-32">
              <SelectValue placeholder="Types" />
            </SelectTrigger>
            <SelectContent>
              {benType?.map((item) => {
                return (
                  <SelectItem key={item.key} value={item.value}>
                    {item.key}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
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
            {!isLoading ? (
              <div className={`w-full h-full bg-secondary`}>
                <div className="rounded border mb-8 bg-card">
                  <Table>
                    <ScrollArea className="h-[calc(100vh-520px)]">
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
                              className="text-center"
                            >
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </ScrollArea>
                  </Table>
                  <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 border-t-2 bg-card">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {selectedRows.length} of{' '}
                      {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">Rows per page</div>
                      <Select
                        defaultValue="10"
                        onValueChange={(value) =>
                          table.setPageSize(Number(value))
                        }
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
                        onClick={(e) => {
                          e.preventDefault();
                          table.previousPage();
                        }}
                        disabled={!table.getCanPreviousPage()}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <TableLoader />
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddAudience;
