'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
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

const data: Transaction[] = [
  {
    id: 'm5gr84i9',
    topic: 'Received',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda.....sd',
    to: 'sd2.......ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '100 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Disbursed',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda........sd',
    to: 'sd2.........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '500 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Received',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda....sd',
    to: 'sd2.......ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '100 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Disbursed',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda.......sd',
    to: 'sd2........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '500 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Received',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda........sd',
    to: 'sd2........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '100 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Disbursed',
    beneficiaryId: 'xas21w213dwq',
    from: 'soa...',
    to: 'sd2........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: '...sd',
    amount: '500 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Received',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda.....sd',
    to: 'sd2.......ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '100 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Disbursed',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda........sd',
    to: 'sd2.........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '500 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Received',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda....sd',
    to: 'sd2.......ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '100 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Disbursed',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda.......sd',
    to: 'sd2........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '500 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Received',
    beneficiaryId: 'xas21w213dwq',
    from: 'sda........sd',
    to: 'sd2........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: 'x23......2w',
    amount: '100 USDC',
    txnFee: '0.009 USDC',
  },
  {
    id: 'm5gr84i9',
    topic: 'Disbursed',
    beneficiaryId: 'xas21w213dwq',
    from: 'soa...',
    to: 'sd2........ad',
    timestamp: '2024-02-27T09:00:00Z',
    txnHash: '...sd',
    amount: '500 USDC',
    txnFee: '0.009 USDC',
  },
];

export type Transaction = {
  id: string;
  topic: string;
  beneficiaryId: string;
  from: string;
  to: string;
  timestamp: string;
  txnHash: string;
  amount: string;
  txnFee: string;
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
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('topic')}</div>
    ),
  },
  {
    accessorKey: 'beneficiaryId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          BeneficiaryId
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('beneficiaryId')}</div>
    ),
  },
  {
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => <div className="capitalize">{row.getValue('from')}</div>,
  },
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => <div className="capitalize">{row.getValue('to')}</div>,
  },
  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('timestamp')}</div>
    ),
  },
  {
    accessorKey: 'txnHash',
    header: 'TxnHash',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('txnHash')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'txnFee',
    header: 'TxnFee',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('txnFee')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(transaction.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TransactionView() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    <div className="p-2 bg-secondary">
      <div className="flex justify-between items-center mb-2">
        <Input
          placeholder="Filter topics..."
          value={(table.getColumn('topic')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('topic')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded border bg-card">
        <Table>
          <ScrollArea className="h-[cal(100vh-182px)]">
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
