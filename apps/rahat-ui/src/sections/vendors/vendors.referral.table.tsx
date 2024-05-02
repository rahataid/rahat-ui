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
import { ArrowUpDown } from 'lucide-react';
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

import { useProjectAction } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TableLoader from '../../components/table.loader';
import { formatdbDate } from '../../utils';

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
    accessorKey: 'referrerBen',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Beneficiary
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('referrerBen')}</div>,
  },

  {
    accessorKey: 'timeStamp',
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
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('timeStamp')}</div>
    ),
  },
  {
    accessorKey: 'referredBy',
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Referred By
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('referredBy')}</div>,
  },
];

export default function ReferralTable({ name, projectId, vendorId }) {
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

  const getVendorReferrals = useProjectAction();

  React.useEffect(() => {
    async function fetchData() {
      const res = await getVendorReferrals.mutateAsync({
        uuid: projectId,
        data: {
          action: 'elProject.beneficiaryReferred',
          payload: {
            vendorId,
          },
        },
      });
      const filteredData = res?.data?.result.map((item) => {
        return {
          referrerBen: item?.piiData?.name,
          referredBy: name,
          timeStamp: formatdbDate(item?.createdAt),
          phone: item?.phoneNumber,
        };
      });
      setData(filteredData);
    }
    fetchData();
  }, []);

  return (
    <div className="w-full h-full bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter Referrals..."
          value={
            (table.getColumn('walletAddress')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('walletAddress')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded border h-[calc(100vh-180px)] bg-card">
        <Table>
          <ScrollArea className="w-full h-withPage px-4 py-1">
            <TableHeader>
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
                    {getVendorReferrals.isPending ? (
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
  );
}
