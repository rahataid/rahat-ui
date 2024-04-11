'use client';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { useProjectAction, useUpdateElRedemption } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { useParams } from 'next/navigation';
import { useTableColumns } from './useTableColumns';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

export type Redemption = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};

export default function RedemptionTable({}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const projectModal = useBoolean();

  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleAssignModalClick = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };

  const columns = useTableColumns(handleAssignModalClick);

  const [perPage, setPerPage] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(2);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

  const uuid = useParams().id;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getRedemption = useProjectAction();
  const updateRedemption = useUpdateElRedemption();

  const getRedemptionList = async () => {
    const result = await getRedemption.mutateAsync({
      uuid,
      data: {
        action: 'elProject.listRedemption',
        payload: {
          page: currentPage,
          perPage,
        },
      },
    });

    const filterData = result?.data.map((row: any) => {
      return {
        name: row.Vendor.name,
        walletAddress: row.Vendor.walletAddress,
        tokenAmount: row.voucherNumber,
        status: row.status,
        uuid: row.uuid,
      };
    });
    setData(filterData);
  };

  React.useEffect(() => {
    getRedemptionList();
  }, []);

  const handleApprove = async () => {
    await updateRedemption.mutateAsync({
      projectUUID: uuid,
      redemptionUUID: selectedRow?.uuid,
    });
    projectModal.onFalse();
  };
  React.useEffect(() => {
    getRedemptionList();
  }, []);

  return (
    <>
      <div className="w-full h-full p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter Redemptions..."
            value={
              (table.getColumn('beneficiary')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('beneficiary')?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
        </div>
        <div className="rounded border h-[calc(100vh-180px)] bg-card">
          <Table>
            <ScrollArea className="h-table1">
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {getRedemption.isPending ? (
                        <TableLoader />
                      ) : (
                        'No data available.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
        <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 border-t-2 bg-card">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
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
      </div>
      <div className="py-2 w-full border-t">
        <div className="p-4 flex flex-col gap-0.5 text-sm">
          <Dialog
            open={projectModal.value}
            onOpenChange={projectModal.onToggle}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve Redemption</DialogTitle>
                <DialogDescription>
                  <p className="text-orange-500">
                    Are you sure you want to approve the redemption?
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleApprove}
                  type="button"
                  variant="ghost"
                  className="text-primary"
                >
                  Assign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
