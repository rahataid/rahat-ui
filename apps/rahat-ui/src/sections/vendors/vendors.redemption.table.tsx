'use client';
import {
  ColumnDef,
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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

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

import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useProjectAction } from '@rahat-ui/query';
import { MS_ACTIONS } from '@rahataid/sdk';
import { formatdbDate } from '../../utils';
import TableLoader from '../../components/table.loader';

export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  phoneNumber: string;
  timestamp: string;
  referredBy: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'voucherNumber',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Voucher Amount
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('voucherNumber')}</div>
    ),
  },

  {
    accessorKey: 'voucherType',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Voucher Type
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('voucherType')}</div>,
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Timestamp
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('timestamp')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Redemption Status
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
  },
];

export default function RedemptionTable({ projectId, vendorId }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

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

  const getVendorRedemption = useProjectAction();

  React.useEffect(() => {
    async function fetchData() {
      const res = await getVendorRedemption.mutateAsync({
        uuid: projectId,
        data: {
          action: MS_ACTIONS.ELPROJECT.GET_VENDOR_REDEMPTION,
          payload: {
            vendorId,
          },
        },
      });
      const filteredData = res?.data?.map((item) => {
        return {
          voucherNumber: item?.voucherNumber,
          voucherType: item?.voucherType,
          status: item?.status,
          timestamp: formatdbDate(item?.createdAt),
        };
      });
      setData(filteredData);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="rounded border h-[calc(100vh-180px)] bg-card">
        <Table>
          <ScrollArea className="h-[calc(100vh-210px)]">
            <TableHeader className="bg-card sticky top-0 z-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-primary" key={header.id}>
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
                      <TableCell className="w-1/3 text-left" key={cell.id}>
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
                    {getVendorRedemption.isPending ? (
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
    </>
  );
}
