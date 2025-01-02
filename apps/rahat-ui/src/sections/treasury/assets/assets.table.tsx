'use client';
import {
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
import { Eye } from 'lucide-react';
import * as React from 'react';

import { useSettingsStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
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
import { useRouter } from 'next/navigation';
import { useTreasuryTokenList } from 'libs/query/src/lib/treasury/treasury.service';
import { shortenAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';

export type Redeptions = {
  id: string;
  name: string;
  amount: number;
  status: string;
  action: string;
  contractAddress: string;
};

export default function AssetsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const appContractSettings = useSettingsStore((state) => state.contracts);

  const initialData: Redeptions[] = [
    {
      id: '1',
      name: 'Rahat Token',
      amount: 9000,
      status: 'Paid',
      action: 'view',
      contractAddress: appContractSettings?.RAHATTOKEN?.ADDRESS,
    },
  ];

  const newData = useTreasuryTokenList();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState(initialData);
  const router = useRouter();

  const columns: ColumnDef<Redeptions>[] = [
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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },

    {
      accessorKey: 'symbol',
      header: 'Symbol',
      cell: ({ row }) => <div>{row.getValue('symbol')}</div>,
    },
    {
      accessorKey: 'fromBlock',
      header: 'BlockNumber',
      cell: ({ row }) => <div>{row.getValue('fromBlock')}</div>,
    },

    {
      accessorKey: 'decimals',
      header: 'Decimals',
      cell: ({ row }) => <div>{row.getValue('decimals')}</div>,
    },
    {
      accessorKey: 'initialSupply',
      header: 'Initial Supply',
      cell: ({ row }) => <div>{row.getValue('initialSupply')}</div>,
    },

    {
      accessorKey: 'contractAddress',
      header: 'Contract Address',
      cell: ({ row }) => (
        <div>{shortenAddress(row.getValue('contractAddress'))}</div>
      ),
    },

    {
      id: 'actions',
      enableHiding: true,
      cell: ({ row }) => {
        return (
          <Eye
            onClick={() =>
              router.push('/treasury/assets/' + row.original.contractAddress)
            }
            className="cursor-pointer"
            size={18}
            strokeWidth={1.5}
          />
        );
      },
    },
  ];
  const table = useReactTable({
    data: newData?.data?.data?.data ?? [],
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
          placeholder="Search Name..."
          value={(table?.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded border bg-card">
        <ScrollArea className="h-[calc(100vh-184px)]">
          <Table>
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
          </Table>
        </ScrollArea>
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
