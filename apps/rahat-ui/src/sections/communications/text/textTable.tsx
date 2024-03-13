'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { MoreHorizontal, Settings2 } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@rahat-ui/shadcn/components/select';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { useCampaignStore, useListCampaignQuery } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import {
  ServiceContext,
  ServiceContextType,
} from 'apps/rahat-ui/src/providers/service.provider';
import { ICampaignItemApiResponse } from '@rumsan/communication';

export type Text = {
  id: number;
  campaign: string;
  startTime: string;
  status: string;
  transport: string;
  totalAudiences: number;
};

export const columns: ColumnDef<ICampaignItemApiResponse>[] = [
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
    accessorKey: 'name',
    header: 'Campaigns',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'startTime',
    header: 'Start Time',
    cell: ({ row }) => (
      <div className="capitalize">
        {new Date(row.getValue('startTime')).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="secondary" className="rounded-md capitalize">
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'transport',
    header: 'Transport',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('transport')}</div>
    ),
  },
  {
    accessorKey: 'totalAudiences',
    header: 'Total Audiences',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('totalAudiences')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  paths.dashboard.communication.textDetail(row.original.id)
                )
              }
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  paths.dashboard.communication.editTextCampaign(
                    row.original.id
                  )
                )
              }
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TextTableView() {
  const campaignStore = useCampaignStore();
  const { communicationQuery } = React.useContext(
    ServiceContext
  ) as ServiceContextType;

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading, isError, isSuccess, isFetched } =
    communicationQuery.useListCampaign({
      page: 1,
      perPage: 10,
    });
  console.log(isSuccess, data);

  const tableData = React.useMemo(() => {
    const result = Array.isArray(data?.data?.rows)
      ? data?.data?.rows.filter(
          (campaign: any) => campaign.type !== CAMPAIGN_TYPES.PHONE
        )
      : [];

    campaignStore.setTotalTextCampaign(result?.length || 0);
    return result as ICampaignItemApiResponse[];
  }, [isSuccess, data?.data]);

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
      rowSelection,
    },
  });

  return (
    <div className="p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter campaigns..."
          value={
            (table.getColumn('name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-3"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-5" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded border bg-white">
        <Table>
          <ScrollArea className="h-table1">
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
                              header.getContext()
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
                          cell.getContext()
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
      <div className="flex items-center justify-end space-x-8 p-2 border-t">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Rows per page</div>
          <Select
            defaultValue="10"
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-16">
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
  );
}
