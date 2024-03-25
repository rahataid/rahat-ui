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
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { useGraphService } from '../../providers/subgraph-provider';
import { formatDate } from '../../utils';

const data: Transaction[] = [
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
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('topic')}</div>
    ),
  },
  {
    accessorKey: 'beneficiary',
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
      <div className="lowercase">
        {truncateEthAddress(row.getValue('beneficiary'))}
      </div>
    ),
  },
  {
    accessorKey: 'voucherId',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          VoucherId
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {truncateEthAddress(row.getValue('voucherId'))}
      </div>
    ),
  },
  {
    accessorKey: 'timestamp',
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
      <div className="lowercase">{row.getValue('timestamp')}</div>
    ),
  },
  {
    accessorKey: 'txHash',
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
        {truncateEthAddress(row.getValue('txHash'))}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment Txhash
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TransactionTable({ walletAddress }) {
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
  const { queryService } = useGraphService();
  const fetchBeneficiary = React.useCallback(() => {
    // const querRes = queryService.useProjectTransaction();
    const querRes = queryService.useBeneficiaryTransaction(walletAddress);

    querRes.then((res) => {
      const claimedAssigned = res?.claimAssigneds;
      const claimProcessed = res?.projectClaimProcesseds;
      const beneficiaryReferred = res?.beneficiaryReferreds;
      const beneficiaryAdded = res?.beneficiaryAddeds;
      const claimCreated = res?.claimCreateds;
      const tokenBudgetIncrease = res?.tokenBudgetIncreases;
      const data: any = [];

      claimedAssigned?.map((trans) => {
        data.push({
          beneficiary: trans.beneficiary,
          topic: trans.eventType,
          timestamp: formatDate(trans.blockTimestamp),
          txHash: trans.transactionHash,
          voucherId: trans.tokenAddress,
        });
        // const claimRes = queryService?.useClaimAssigned(trans.id);
      });
      claimProcessed?.map((trans) => {
        data.push({
          beneficiary: trans.beneficiary,
          topic: trans.eventType,
          timestamp: formatDate(trans.blockTimestamp),
          txHash: trans.transactionHash,
          voucherId: trans.token,
        });
      });
      beneficiaryReferred?.map((trans) => {
        data.push({
          beneficiary: trans.referrerBeneficiaries,
          topic: trans.eventType,
          timestamp: formatDate(trans.blockTimestamp),
          txHash: trans.transactionHash,
        });
      });

      claimCreated?.map((trans) => {
        data.push({
          beneficiary: trans.claimer,
          txHash: trans.transactionHash,
          timestamp: formatDate(trans.blockTimestamp),
          topic: trans?.eventType,
          voucherId: trans.token,
        });
      });

      beneficiaryAdded?.map((trans) => {
        data.push({
          topic: trans.eventType,
          timestamp: formatDate(trans.blockTimestamp),
          txHash: trans.transactionHash,
          beneficiary: trans.beneficiaryAddress,
        });
      });

      tokenBudgetIncrease?.map((trans) => {
        data.push({
          topic: trans.eventType,
          txHash: trans.transactionHash,
          timestamp: formatDate(trans.blockTimestamp),
          voucherId: trans?.tokenAddress,
        });
      });
      setData(data);
    });
  }, [queryService]);

  React.useEffect(() => {
    fetchBeneficiary();
  }, [fetchBeneficiary]);

  return (
    <div className="w-full h-full bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter Transactions..."
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
            <TableHeader className="sticky top-0">
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
