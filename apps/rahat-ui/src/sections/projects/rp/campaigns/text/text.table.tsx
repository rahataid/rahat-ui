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
import {
  Mail,
  MessageCircle,
  MessageCircleMore,
  PhoneCall,
  Settings2,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import * as React from 'react';

import { useCampaignStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useListCampaign } from '@rumsan/communication-query';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import useTextTableColumn from './useTextTableColumn';

export type Text = {
  id: number;
  campaign: string;
  startTime: string;
  status: string;
  transport: string;
  totalAudiences: number;
};

export default function TextTable() {
  const campaignStore = useCampaignStore();
  const columns = useTextTableColumn();
  const { id } = useParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading, isError, isSuccess, isFetching } = useListCampaign({
    projectId: id,
  });

  const tableData = React.useMemo(() => {
    const result = Array.isArray(data?.response.data.rows)
      ? data?.response?.data?.rows?.filter(
          (campaign: any) => campaign.type !== CAMPAIGN_TYPES.PHONE,
        )
      : [];

    campaignStore.setTotalTextCampaign(data?.response?.meta?.total || 0);
    return result;
  }, [isSuccess, data]);

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
    <div className="w-full h-full p-2 bg-secondary">
      <div className=" grid sm:grid-cols-1 md:grid-cols-4 gap-2 mb-2">
        <DataCard className="" title="IVR" number={'0'} Icon={PhoneCall} />
        <DataCard className="" title="Emails" number={'0'} Icon={Mail} />
        <DataCard className="" title="SMS" number={'0'} Icon={MessageCircle} />
        <DataCard
          className=""
          title="Whatsapp"
          number={'0'}
          Icon={MessageCircleMore}
        />
      </div>
      <div className="flex items-center mt-4 mb-2">
        <Input
          placeholder="Filter campaigns..."
          value={
            (table.getColumn('campaign')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('campaign')?.setFilterValue(event.target.value)
          }
          className="max-w-mx mr-3"
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
      <div className="rounded border bg-card">
        <Table>
          <ScrollArea className="w-full h-[calc(100vh-320px)]">
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
                    {isFetching ? (
                      <div className="flex items-center justify-center space-x-2 h-full">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                      </div>
                    ) : (
                      'No data available.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-2 border-t bg-card">
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
