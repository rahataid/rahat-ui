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

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useBeneficiaryTransaction } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { useQuery } from 'urql';
import { BeneficiaryTransaction } from '@rahat-ui/query';
import { formatEther, formatUnits } from 'viem';
import Image from 'next/image';
import Link from 'next/link';

export type Transaction = {
  beneficiary: any;
  vendor: any;
  processedBy: any;
  topic: any;
  timeStamp: string;
  transactionHash: any;
  amount: string;
  voucherId: any;
  id: any;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => <div>{row.getValue('topic')}</div>,
  },
  {
    accessorKey: 'blockNumber',
    header: 'Block Number',
    cell: ({ row }) => <div>{row.getValue('blockNumber')}</div>,
  },
  {
    accessorKey: 'date',
    header: 'Time Stamp',
    cell: ({ row }) => <div> {row.getValue('date')}</div>,
  },
  {
    accessorKey: 'transactionHash',
    header: 'Transaction Hash',
    cell: ({ row }) => (
      <div>
        <Link
          target="_blank"
          href={`https://sepolia.basescan.org/tx/${row.original.transactionHash}`}
        >
          {' '}
          {`${row
            .getValue('transactionHash')
            ?.toString()
            .substring(0, 4)}....${row
            .getValue('transactionHash')
            ?.toString()
            ?.slice(-3)}`}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue('amount')} USDC
        </div>
      );
    },
  },
];

export default function BeneficiaryDetailTableView({
  walletAddress,
  transaction,
}: {
  walletAddress: string;
  transaction: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const { isFetching } = useBeneficiaryTransaction(walletAddress);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  console.log('transaction', transaction);

  const table = useReactTable({
    manualPagination: true,
    data: transaction || [],
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
    <>
      <div className="rounded border">
        <Table>
          <ScrollArea className="h-[calc(100vh-368px)]">
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
              {isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <TableLoader />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
                    <div className="w-full h-[calc(100vh-140px)]">
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src="/noData.png"
                          height={250}
                          width={250}
                          alt="no data"
                        />
                        <p className="text-medium text-base mb-1">
                          No Data Available
                        </p>
                        <p className="text-sm mb-4 text-gray-500">
                          There are no transactions to display at the moment.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 mt-2 bg-card">
        <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 bg-card">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Rows per page</div>
            <Select
              defaultValue="10"
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="5">5</SelectItem>
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
    </>
  );
}
