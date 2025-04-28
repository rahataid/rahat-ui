'use client';

import { Input } from '@rahat-ui/shadcn/components/input';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { User } from '@rumsan/sdk/types';
import { Table, flexRender } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import AddButton from '../projects/components/add.btn';
import ViewColumns from '../projects/components/view.columns';
import TableLoader from '../../components/table.loader';

type IProps = {
  table: Table<User>;
  loading: boolean;
};

export default function UsersTable({ table, loading }: IProps) {
  const router = useRouter();

  return (
    <>
      <div className="p-4 border rounded-sm ">
        <div className="flex items-center space-x-2 mb-2">
          <Input
            placeholder="Search User..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded"
          />
          <ViewColumns table={table} />
          <AddButton
            className="text-white border hover:border-blue-500 hover:text-blue-500"
            name="User"
            path="/users/add"
          />
        </div>
        <div>
          <ScrollArea className="h-[calc(100vh-303px)]">
            {loading ? (
              <TableLoader />
            ) : (
              <TableComponent>
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
                        colSpan={table.getAllColumns().length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </TableComponent>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
