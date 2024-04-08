'use client';

import * as React from 'react';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetReferredVoucherTransaction } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'transactionHash',
    header: 'TransactionHash',
    cell: ({ row }) => (
      <div className="capitalize">
        {truncateEthAddress(row.getValue('transactionHash'))}
      </div>
    ),
  },
  {
    accessorKey: 'from',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          From
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {truncateEthAddress(row.getValue('from'))}
      </div>
    ),
  },
  {
    accessorKey: 'to',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          To
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{truncateEthAddress(row.getValue('to'))}</div>
    ),
  },
  {
    accessorKey: 'value',
    header: () => <div className="text-right">Voucher</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('value'));

      // Format the amount as a dollar amount
      // const formatted = new Intl.NumberFormat('en-US', {
      //   style: 'currency',
      //   currency: 'USD',
      // }).format(amount);

      return <div className="text-right font-medium">{amount}</div>;
    },
  },
];

export function DiscountTransactionTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [contractAddress, setContractAddress] = useState<any>();

  const { id } = useParams();

  const projectSettings = localStorage.getItem('projectSettingsStore');

  useEffect(() => {
    if (projectSettings) {
      const settings = JSON.parse(projectSettings)?.state?.settings?.[id];
      setContractAddress({
        referredVoucher: settings?.referralvoucher?.address,
      });
    }
  }, [projectSettings]);

  const { data: vouchersTransactions } = useGetReferredVoucherTransaction(
    contractAddress?.referredVoucher,
  );

  const table = useReactTable({
    data: vouchersTransactions?.transfers || [],
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

  return (
    <div className="w-full h-full bg-card">
      <div className="flex items-center justify-between py-2 px-2">
        <h1 className="text-primary">Transactions</h1>
      </div>
      <div className="rounded border">
        <Table>
          <ScrollArea className="h-[calc(100vh-494px)]">
            <TableHeader className="top-0 sticky bg-card">
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
    </div>
  );
}
