'use client';

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

import { flexRender } from '@tanstack/react-table';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type AddAudienceProps = {
  table: any;
  form: UseFormReturn<z.infer<any>>;
  columns: any;
};

const AddAudience: FC<AddAudienceProps> = ({ table, form, columns }) => {
  return (
    <>
      {' '}
      <FormField
        control={form.control}
        name="audiences"
        render={() => (
          <FormItem>
            {/* <div className="mb-4">
                    <FormLabel className="text-base">Audiences</FormLabel>
                  </div> */}
            <div className="rounded-md border max-h-[300px] overflow-y-auto">
              <Table>
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
