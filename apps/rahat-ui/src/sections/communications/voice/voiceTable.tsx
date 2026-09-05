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
import VoiceTableData from '../../../app/communications/voice/voiceData.json';
import { paths } from '../../../routes/paths';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useCampaignStore, useListCampaignQuery } from '@rahat-ui/query';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { getColumnLabel } from 'apps/rahat-ui/src/utils/getColumnLabel';

const data: Voice[] = VoiceTableData;

export type Voice = {
  id: number;
  campaign: string;
  startTime: string;
  status: string;
  transport: string;
  totalAudiences: number;
};

export const columns: ColumnDef<Voice>[] = [
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
                  paths.dashboard.communication.voiceDetail(row.original.id),
                )
              }
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function VoiceTableView() {
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const campaignStore = useCampaignStore();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading, isError, isSuccess, isFetched } =
    useListCampaignQuery({});

  const tableData = React.useMemo(() => {
    const result = Array.isArray(data?.rows)
      ? data?.rows.filter(
          (campaign: any) => campaign.type === CAMPAIGN_TYPES.PHONE,
        )
      : [];
    campaignStore.setTotalVoiceCampaign(result?.length);

    return result;
  }, [isSuccess]);

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
          placeholder={tg('FILTER_CAMPAIGNS')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm mr-3"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-5" />
              {tg('VIEW')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{tg('TOGGLE_COLUMNS')}</DropdownMenuLabel>
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
                    {getColumnLabel(column)}
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
                    {tg('NO_RESULTS')}
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
          {table.getFilteredRowModel().rows.length} {tg('ROW_S_SELECTED')}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{tg('ROWS_PER_PAGE')}</div>
          <Select
            defaultValue="10"
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">{formatNum(5)}</SelectItem>
                <SelectItem value="10">{formatNum(10)}</SelectItem>
                <SelectItem value="20">{formatNum(20)}</SelectItem>
                <SelectItem value="30">{formatNum(30)}</SelectItem>
                <SelectItem value="40">{formatNum(40)}</SelectItem>
                <SelectItem value="50">{formatNum(50)}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          {tg('PAGE_CURRENT_OF_TOTAL', { current: formatNum(table.getState().pagination.pageIndex + 1), total: formatNum(table.getPageCount()) })}
        </div>
        <div className="space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {tg('PREVIOUS')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {tg('NEXT')}
          </Button>
        </div>
      </div>
    </div>
  );
}
