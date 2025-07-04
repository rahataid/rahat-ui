'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
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
import * as React from 'react';

import { useVendorTransaction } from '../../hooks/el/subgraph/querycall';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import TableLoader from '../../components/table.loader';
import { useRPVendorTransactions } from '@rahat-ui/query';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Pagination from '../../components/pagination';

// export type Payment = {
//   id: string;
//   amount: number;
//   status: 'pending' | 'processing' | 'success' | 'failed';
//   email: string;
//   walletAddress: `0x${string}`;
// };

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('topic')}</div>
    ),
  },
  {
    accessorKey: 'txHash',
    header: 'Txn Hash',
    cell: ({ row }) => (
      <a href={`https://sepolia.basescan.org/tx/${row.getValue('txHash')}`}>
        {' '}
        {truncateEthAddress(row.getValue('txHash'))}
      </a>
      // <div>{`https://sepolia.arbiscan.io/tx/${truncateEthAddress(row.getValue('transactionHash'))}`}</div>
    ),
  },
  {
    accessorKey: 'timeStamp',
    header: () => <div className="text-right">Timestamp</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {row.getValue('timeStamp')}
        </div>
      );
    },
  },
];

interface VendorTxnListProps {
  walletAddress: string;
}

export default function VendorTxnList({ walletAddress }: VendorTxnListProps) {
  const { data: txns, isFetching } = useRPVendorTransactions(walletAddress);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: txns || [],
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
                    {isFetching ? <TableLoader /> : 'No data available.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <Pagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        setPageSize={table.setPageSize}
        canPreviousPage={table.getCanPreviousPage()}
        previousPage={table.previousPage}
        canNextPage={table.getCanNextPage()}
        nextPage={table.nextPage}
      />
    </>
  );
}
