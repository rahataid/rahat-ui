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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
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
import { useTransactionList } from 'apps/rahat-ui/src/hooks/cva/subgraph/queryCall';

const dummyData: Transaction[] = [
  {
    id: 'm5gr84i9',
    topic: 'Claim Processed',
    beneficiary: 1234567890,
    voucherId: 'ABC123',
    timestamp: '2024-02-27T08:00:00Z',
    txHash: '0x123456789abcdef',
  },
  {
    id: '3u1reuv4',
    topic: 'Claim Approved',
    beneficiary: 5678234324,
    voucherId: 'DEF456',
    timestamp: '2024-02-27T09:00:00Z',
    txHash: '0x987654321abcdef',
  },
  {
    id: 'derv1ws0',
    topic: 'Claim Rejected',
    beneficiary: 90124353534,
    voucherId: 'GHI789',
    timestamp: '2024-02-27T10:00:00Z',
    txHash: '0xfedcba9876543210',
  },
  {
    id: '5kma53ae',
    topic: 'Payment Processed',
    beneficiary: 34563453534,
    voucherId: 'JKL012',
    timestamp: '2024-02-27T11:00:00Z',
    txHash: '0xabcdef1234567890',
  },
  {
    id: 'bhqecj4p',
    topic: 'Payment Failed',
    beneficiary: 7890345345,
    voucherId: 'MNO345',
    timestamp: '2024-02-27T12:00:00Z',
    txHash: '0x0123456789abcdef',
  },
  {
    id: 'p9o8i7u6',
    topic: 'Claim Approved',
    beneficiary: 1234567567,
    voucherId: 'PQR678',
    timestamp: '2024-02-27T13:00:00Z',
    txHash: '0xfedcba9876543210',
  },
  {
    id: '3v4b5n6m',
    topic: 'Payment Processed',
    beneficiary: 5678456456,
    voucherId: 'STU901',
    timestamp: '2024-02-27T14:00:00Z',
    txHash: '0xabcdef0123456789',
  },
  {
    id: 'a1s2d3f4',
    topic: 'Claim Processed',
    beneficiary: 9012456456,
    voucherId: 'VWX234',
    timestamp: '2024-02-27T15:00:00Z',
    txHash: '0x0123456789abcdef',
  },
  {
    id: 'q2w3e4r5',
    topic: 'Claim Rejected',
    beneficiary: 3456456456,
    voucherId: 'YZA567',
    timestamp: '2024-02-27T16:00:00Z',
    txHash: '0xabcdef0123456789',
  },
  {
    id: 'zxcvbnml',
    topic: 'Payment Failed',
    beneficiary: 7890345345,
    voucherId: 'BCD890',
    timestamp: '2024-02-27T17:00:00Z',
    txHash: '0x0123456789abcdef',
  },
  {
    id: 'qwertyui',
    topic: 'Payment Processed',
    beneficiary: 1234345456,
    voucherId: 'EFG901',
    timestamp: '2024-02-27T18:00:00Z',
    txHash: '0xfedcba9876543210',
  },
  {
    id: 'asdfghjk',
    topic: 'Claim Approved',
    beneficiary: 5678456345,
    voucherId: 'HIJ234',
    timestamp: '2024-02-27T19:00:00Z',
    txHash: '0xabcdef0123456789',
  },
  {
    id: 'poiuytre',
    topic: 'Claim Processed',
    beneficiary: 9012345345,
    voucherId: 'KLM567',
    timestamp: '2028-02-27T20:00:00Z',
    txHash: '0x0123456789abcdef',
  },
  {
    id: 'lkjhgfds',
    topic: 'Payment Failed',
    beneficiary: 3456345345,
    voucherId: 'NOP890',
    timestamp: '2024-02-27T21:00:00Z',
    txHash: '0xabcdef0123456789',
  },
  {
    id: 'mnbvcxz1',
    topic: 'Payment Processed',
    beneficiary: 78902343456,
    voucherId: 'QRS234',
    timestamp: '2024-02-27T22:00:00Z',
    txHash: '0x0123456789abcdef',
  },
];

export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '__typename',
    header: 'Topic',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('__typename')}</div>
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
          Beneficiary
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{truncateEthAddress(row.getValue('to'))}</div>
    ),
  },
  {
    accessorKey: 'blockNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Block Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('blockNumber')}</div>
    ),
  },
  {
    accessorKey: 'blockTimestamp',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('blockTimestamp')}</div>
    ),
  },
  {
    accessorKey: 'transactionHash',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          TxHash
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {truncateEthAddress(row.getValue('transactionHash'))}
      </div>
    ),
  },
];

export default function TransactionTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data] = React.useState(dummyData);

  const { data: transactionData, error: transactionError } =
    useTransactionList();
  React.useEffect(() => {
    setData(transactionData);
  }, [transactionData]);

  console.log({ transactionData });

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

  return (
    <div className="w-full p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter Beneficiary..."
          value={
            (table.getColumn('beneficiary')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('beneficiary')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded border bg-white">
        <Table>
          <ScrollArea className="h-[calc(100vh-184px)]">
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
                    colSpan={columns.length || 10}
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
      <div className="flex items-center justify-end space-x-2 py-2">
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
            Previous not good
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
