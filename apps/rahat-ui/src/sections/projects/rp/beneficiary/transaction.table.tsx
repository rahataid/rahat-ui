'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { ArrowUpDown } from 'lucide-react';
import * as React from 'react';
import { useRPBeneficiaryTransactions } from '@rahat-ui/query';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import Pagination from 'apps/rahat-ui/src/components/pagination';

const data = [
  {
    id: '1',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '2',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '3',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '4',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '5',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '6',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '7',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '8',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '9',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '10',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '11',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '12',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '13',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '14',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '15',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '16',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '17',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
  {
    id: '18',
    topic: 'ClaimCreated',
    amount: '1,23,122',
    timestamp: '21 June, 2020 12:13 AM',
    txHash: '-',
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'topic',
    header: 'Topic',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('topic')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('amount')}</div>
    ),
  },
  {
    accessorKey: 'timeStamp',
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
      <div className="lowercase">{row.getValue('timeStamp')}</div>
    ),
  },
  {
    accessorKey: 'txHash',
    header: 'TxHash',
    cell: ({ row }) => (
      <div className="capitalize">
        {truncateEthAddress(row.getValue('txHash'))}
      </div>
    ),
  },
];

export function TransactionTable({ beneficiaryDetails }: any) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { beneficiary } = beneficiaryDetails;

  const [rowSelection, setRowSelection] = React.useState({});
  const { data: beneficiaryTxn, isSuccess } = useRPBeneficiaryTransactions(
    beneficiary.walletAddress || '',
  );

  const tableData: any = React.useMemo(() => {
    if (isSuccess) return beneficiaryTxn;
    else return [];
  }, [beneficiaryTxn, isSuccess]);

  const table = useReactTable({
    data: tableData || [],
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
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <ScrollArea className="h-[calc(100vh-250px)]">
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
      <Pagination
        pageIndex={table.getState().pagination.pageIndex}
        pageCount={table.getPageCount()}
        setPageSize={table.setPageSize}
        canPreviousPage={table.getCanPreviousPage()}
        previousPage={table.previousPage}
        canNextPage={table.getCanNextPage()}
        nextPage={table.nextPage}
      />
    </div>
  );
}
