'use client';
import {
  PROJECT_SETTINGS_KEYS,
  useContractRedeem,
  useListRedemptions,
  useProjectSettingsStore,
} from '@rahat-ui/query';
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
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
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
import { UUID } from 'crypto';
import { ChevronDown, History } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useRedemptionTableColumn } from './useRedemptionTableColumn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { usePagination } from '@rahat-ui/query';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


export type Redeptions = {
  id: string;
  name: string;
  amount: number;
  status: string;
};

export const redemptionType = [
  {
    key: 'ALL',
    value: 'ALL',
  },
  {
    key: 'REQUESTED',
    value: 'REQUESTED',
  },
  {
    key: 'APPROVED',
    value: 'APPROVED',
  },
];

export default function RedemptionsTable() {
  const { id } = useParams() as { id: UUID };

  const {resetSelectedListItems,filters,setFilters,selectedListItems} = usePagination();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const redeemToken = useContractRedeem(id);
  const { data: redemptions, isSuccess, refetch } = useListRedemptions(id,filters);

  const handleApprove = (row: any) => {
    redeemToken
      .mutateAsync({
        amount: row?.amount,
        tokenAddress: row?.tokenAddress,
        redemptionAddress: contractSettings?.redemptions?.address,
        senderAddress: row?.walletAddress,
        uuid: row?.uuid,
      })
      .finally(() => {
        refetch();
      });
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = useRedemptionTableColumn({ handleApprove });

  const handleRedmpType = React.useCallback(
    (type: string) => {
      resetSelectedListItems();
      if (type === 'ALL') {
        setFilters({ ...filters, status: undefined });
        return;
      }
      console.log(type)
      setFilters({ ...filters, status: type });
    },
    [filters, setFilters],
  );

  const tableData = React.useMemo(() => {
    if (isSuccess) return redemptions;
    else return [];
  }, [isSuccess, redemptions]);

  React.useEffect(()=>{
    refetch();
  },[filters])

  const table = useReactTable({
    data: tableData,
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
      rowSelection:selectedListItems,
    },
  });

  const selectedRowAddresses = Object.keys(selectedListItems);

  return (
    <div className="w-full p-2 bg-secondary">
      <div className="flex items-center mb-2">
          <Input
            placeholder="Filter Claims..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded mr-2"
          />
          <div className="max-w-sm rounded mr-2">
            <Select
              onValueChange={handleRedmpType}
              // defaultValue={filters?.status || 'ALL'}
            >
              <SelectTrigger>
                <SelectValue placeholder="CLAIMS TYPE" />
              </SelectTrigger>
              <SelectContent>
                {redemptionType.map((item) => {
                  return (
                    <SelectItem key={item.key} value={item.value}>
                      {item.key}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

           {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {selectedRowAddresses.length ? (
                <Button disabled={false} className="h-10 ml-2">
                  {selectedRowAddresses.length} - Items Selected
                  <ChevronDown strokeWidth={1.5} />
                </Button>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleApprove}>
                Approve Redemption
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>  */}
        </div>
      <div className="rounded border bg-card">
        {table.getRowModel().rows?.length ? (
          <>
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
                  {table.getRowModel().rows.map((row) => (
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
                  ))}
                </TableBody>
              </ScrollArea>
            </Table>
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
          </>
        ) : (
          <div className="w-full h-[calc(100vh-140px)]">
            <div className="flex flex-col items-center justify-center">
              <Image src="/noData.png" height={250} width={250} alt="no data" />
              <p className="text-medium text-base mb-1">No Data Available</p>
              <p className="text-sm mb-4 text-gray-500">
                There are no redemptions to display at the moment
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


