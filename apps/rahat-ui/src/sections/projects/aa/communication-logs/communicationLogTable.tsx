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
import { useListTransport } from '@rumsan/communication-query';
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
    accessorKey: 'ward',
    header: 'Ward',
    cell: ({ row }) => <div>{row.getValue('ward')}</div>,
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('duration')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('status')}</div>
    ),
  },
  {
    accessorKey: 'attempts',
    header: 'Attempts',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('attempts')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('createdAt')}</div>
    ),
  },
];

type IProps = {
  data: any;
};
export default function CommunicationLogTable({ data }: IProps) {
  const { data: transportData } = useListTransport();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      ward: false,
      duration: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [tableData, setTableData] = React.useState([]);
  const tData = React.useMemo(() => {
    return data
      ?.filter((data) => data?.transport?.name.toLowerCase() === 'email')
      ?.map((item: any) => ({
        createdAt: new Date(item.createdAt).toLocaleString(),
        status: item?.status,
        to:
          item?.transport.name.toLowerCase() ===
          CAMPAIGN_TYPES.EMAIL.toLowerCase()
            ? item?.details?.envelope?.to
            : item?.transport.name.toLowerCase() ===
              CAMPAIGN_TYPES.IVR.toLowerCase()
            ? item?.audience?.details?.phone
            : item?.details?.to,
      }));
  }, [data]);

  React.useEffect(() => {
    setTableData(tData);
  }, [tData]);

  const filterDataByType = (data, id) => {
    return data
      ?.filter(
        (item) => item?.transport.name.toLowerCase() === id.toLowerCase(),
      )
      ?.map((item) => {
        const baseData = {
          createdAt: new Date(item.createdAt).toLocaleString(),
          status: item?.status,
          to: item?.audience?.details?.phone,
        };

        if (id.toLowerCase() === 'ivr') {
          return {
            ...baseData,
            ward: item?.details?.lineId,
            duration: item?.details?.duration || 0 + ' seconds',
            attempts: 1,
          };
        } else {
          return {
            ...baseData,
            to:
              item?.transport.name.toLowerCase() ===
              CAMPAIGN_TYPES.EMAIL.toLowerCase()
                ? item?.details?.envelope?.to
                : item?.details?.to,
          };
        }
      });
  };

  const setColumnVisibilityByType = (id) => {
    if (id.toLowerCase() === 'ivr') {
      setColumnVisibility({
        ward: true,
        duration: true,
      });
    } else {
      setColumnVisibility({
        ward: false,
        duration: false,
      });
    }
  };

  const filterByType = (id: string) => {
    const filteredData = filterDataByType(data, id);
    setTableData(filteredData);
    setColumnVisibilityByType(id);
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
          <Select defaultValue="Email" onValueChange={(e) => filterByType(e)}>
            <SelectTrigger className="max-w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {transportData?.data?.map((data) => {
                return (
                  <SelectItem key={data.id} value={data.name}>
                    {data.name}
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
