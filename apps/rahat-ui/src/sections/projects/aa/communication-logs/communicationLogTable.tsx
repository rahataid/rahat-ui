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
import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

export type TextDetail = {
  _id: string;
  to: string;
  date: string;
};

export const columns: ColumnDef<TextDetail>[] = [
  {
    accessorKey: 'to',
    header: 'To',
    cell: ({ row }) => <div>{row.getValue('to')}</div>,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('createdAt')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('status')}</div>
    ),
  },
];

type IProps = {
  data: any;
};
export default function CommunicationLogTable({ data }: IProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [tableData, setTableData] = React.useState([]);
  const tData = React.useMemo(() => {
    return data?.map((item: any) => ({
      createdAt: new Date(item.createdAt).toLocaleString(),
      status: item?.status,
      to:
        item?.transport.name.toLowerCase() ===
        CAMPAIGN_TYPES.EMAIL.toLowerCase()
          ? item?.details?.envelope?.to
          : item?.details?.to,
    }));
  }, [data]);

  React.useEffect(() => {
    setTableData(tData);
  }, [tData]);

  const filterBenByProjectId = (id: string) => {
    if (id === 'ALL') {
      const allData = data?.map((item: any) => ({
        createdAt: new Date(item.createdAt).toLocaleString(),
        status: item?.status,
        to:
          item?.transport.name.toLowerCase() ===
          CAMPAIGN_TYPES.EMAIL.toLowerCase()
            ? item?.details?.envelope?.to
            : item?.details?.to,
      }));
      setTableData(allData);
      return;
    }

    const filteredData = data
      ?.filter((item: any) => {
        if (item?.transport?.name.toLowerCase() === id.toLowerCase()) {
          return item;
        }
      })
      ?.map((item: any) => ({
        createdAt: new Date(item.createdAt).toLocaleString(),
        status: item?.status,
        to:
          item?.transport.name.toLowerCase() ===
          CAMPAIGN_TYPES.EMAIL.toLowerCase()
            ? item?.details?.envelope?.to
            : item?.details?.to,
      }));
    setTableData(filteredData);
  };

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
    <div>
      <>
        <div className="flex justify-between gap-2">
          <Input
            placeholder="Search Phone Number"
            value={(table.getColumn('to')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('to')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select onValueChange={(e) => filterBenByProjectId(e)}>
            <SelectTrigger className="max-w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'ALL'}>ALL</SelectItem>
              {Object.keys(CAMPAIGN_TYPES).map((key) => {
                return (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md  border mt-1 bg-card">
          <Table>
            <ScrollArea className="h-[calc(100vh-570px)]">
              <TableHeader className="sticky top-0 bg-slate-50">
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
        <div className="flex items-center justify-end space-x-8 py-4">
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
      </>
    </div>
  );
}
