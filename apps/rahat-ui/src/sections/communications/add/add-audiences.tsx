'use client';

import { useProjectList } from '@rahat-ui/query';
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

import { flexRender } from '@tanstack/react-table';
import React, { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type AddAudienceProps = {
  table: any;
  form: UseFormReturn<z.infer<any>>;
  columns: any;
  filters: any;
  setFilters: any;
  globalFilter: any;
  setGlobalFilter: any;
  selectedRows: Array<any>;
};

const AddAudience: FC<AddAudienceProps> = ({
  table,
  form,
  columns,
  filters,
  setFilters,
  globalFilter,
  setGlobalFilter,
  selectedRows,
}) => {
  const projectsList = useProjectList({});

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

  return (
    <>
      {/* header area start  */}
      <div className="flex items-center gap-2 pb-2">
        <Input
          placeholder="Filter audience..."
          value={globalFilter ?? ''}
          onChange={(value) => {
            setGlobalFilter(value.target.value);
          }}
          className="max-w-sm"
        />
        <Select onValueChange={filterBenByAudience}>
          <SelectTrigger className='max-w-32'>
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
        <div className={`border rounded px-3 py-2 h-10 text-sm ${selectedRows.length ? 'bg-primary text-white font-medium' : 'bg-card'}`}>{selectedRows.length} - Audience selected</div>
      </div>
      {/* header area end  */}
      <FormField
        control={form.control}
        name="audiences"
        render={() => (
          <FormItem>
            <div className="rounded border mb-2 bg-card">
              <Table>
                <ScrollArea className='h-[calc(100vh-376px)]'>
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
    </>
  );
};

export default AddAudience;
