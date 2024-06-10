'use client';

import {
  TransactionDetails,
  useProjectSettingsStore,
  PROJECT_SETTINGS_KEYS,
} from '@rahat-ui/query';
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
import { useQuery } from 'urql';
import { Transaction, TransactionsObject } from './types';
import { mergeTransactions } from './utils';
import { formatEther } from 'viem';
import { shortenTxHash } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { useParams } from 'next/navigation';

// export type Transaction = {
//   id: string;
//   topic: string;
//   beneficiaryId: string;
//   from: string;
//   to: string;
//   timestamp: string;
//   txnHash: string;
//   amount: string;
//   txnFee: string;
// };

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
    accessorKey: 'from',
    header: 'From',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('from') || 'C2C'}</div>
    ),
  },
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('to') || 'C2C'}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Timestamp',
    cell: ({ row }) => <div className="capitalize">{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'blockNumber',
    header: 'Block Number',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('blockNumber')}</div>
    ),
  },
  {
    accessorKey: 'transactionHash',
    header: 'TransactionHash',
    cell: ({ row }) => (
      <div className="capitalize">
        {shortenTxHash(row.getValue('transactionHash'))}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(formatEther(BigInt(row.getValue('amount'))));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export default function TransactionView() {
  const { id } = useParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [transactionList, setTransactionList] = React.useState<Transaction[]>(
    [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: transactionList,
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

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );
  const contractAddress = contractSettings?.c2cproject?.address;

  console.log({ contractAddress });

  const [result] = useQuery({
    query: TransactionDetails,
    variables: {
      contractAddress,
    },
    pause: !contractAddress,
  });

  React.useEffect(() => {
    (async () => {
      const transactionsObject: TransactionsObject = result.data;
      const transactionLists = await mergeTransactions(transactionsObject);
      setTransactionList(transactionLists);
    })();
  }, [result.data]);

  console.log({ transactionList });

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
