'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
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
import { ListBeneficiary } from '@rahat-ui/types';
import BulkAssignToProjectModal from './components/bulkAssignToProjectModal';

type IProps = {
  table: Table<ListBeneficiary>;
  handleBulkAssign: (selectedProject: string) => void;
  isBulkAssigning: boolean;
  projectModal: any;
};

export default function ListView({
  table,
  handleBulkAssign,
  isBulkAssigning,
  projectModal,
}: IProps) {
  console.log("table", table)
  return (
    <>
      <BulkAssignToProjectModal
        handleSubmit={handleBulkAssign}
        projectModal={projectModal}
        selectedBeneficiaries={table
          .getSelectedRowModel()
          .rows.map((row) => row.original.walletAddress)}
      />
      <div className="-mt-2 p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter beneficiary..."
            value={
              (table.getColumn('walletAddress')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn('walletAddress')
                ?.setFilterValue(event.target.value)
            }
            className="rounded mr-2"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-5" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {table.getSelectedRowModel().rows.length ? (
            <Button
              onClick={projectModal.onTrue}
              className="ml-auto"
              disabled={isBulkAssigning}
            >
              Bulk Assign
            </Button>
          ) : null}
        </div>
        <div className="rounded border bg-card h-[calc(100vh-180px)]">
          <TableComponent>
            <ScrollArea className="h-table1">
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
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </TableComponent>
        </div>
      </div>
    </>
  );
}
