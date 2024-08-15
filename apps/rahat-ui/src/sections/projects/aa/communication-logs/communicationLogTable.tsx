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
import { useListCampaign, useListTransport } from '@rumsan/communication-query';
import { Eye, Upload } from 'lucide-react';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import CampaignDetailSplitView from './campaign.detail.split.view';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export type TextDetail = {
  _id: string;
  to: string;
  date: string;
};

const data = [{ name: 'Activity1', createdAt: '14/08/2024', phase: 'READINESS', status: 'WORK_IN_PROGRESS' }]

export default function CommunicationLogTable() {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const openSplitDetailView = (rowDetail: any) => {
    setSecondPanelComponent(
      <>
        <CampaignDetailSplitView
          details={rowDetail}
          closeSecondPanel={closeSecondPanel}
        />
      </>,
    );
  };

  function getStatusBg(status: string) {
    if (status === 'NOT_STARTED') {
      return 'bg-gray-200';
    }

    if (status === 'WORK_IN_PROGRESS') {
      return 'bg-orange-200';
    }

    if (status === 'COMPLETED') {
      return 'bg-green-200';
    }

    if (status === 'DELAYED') {
      return 'bg-red-200';
    }

    return '';
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Title',
      cell: ({ row }) => (
        <div className="capitalize min-w-72">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div className="capitalize min-w-32">
          {new Date(row.getValue('createdAt')).toLocaleString()}
        </div>
      ),
    },
    // {
    //   accessorKey: 'upload',
    //   header: 'Upload',
    //   cell: ({ row }) => (
    //     <div className="capitalize">
    //       {row.getValue('upload')?.length < 10
    //         ? row.getValue('upload')
    //         : row.getValue('upload').substring(0, 10) + '...'}
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: 'type',
    //   header: 'Type',
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue('type')}</div>
    //   ),
    // },
    // {
    //   accessorKey: 'totalAudiences',
    //   header: 'Audiences',
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue('totalAudiences')}</div>
    //   ),
    // },
    {
      accessorKey: 'phase',
      header: 'Phase',
      cell: ({ row }) => (
        <div>{row.getValue('phase')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const bgColor = getStatusBg(status)
        return (
          <Badge className={bgColor}>{status}</Badge>
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            className="hover:text-primary cursor-pointer"
            size={20}
            strokeWidth={1.5}
            onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];

  const {
    data: campaignData,
    isSuccess,
    isLoading,
    refetch,
  } = useListCampaign();

  const { data: transportData } = useListTransport();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      duration: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [tableData, setTableData] = React.useState([]);
  const campaignTableData: any = React.useMemo(() => {
    const result = Array.isArray(campaignData?.data?.rows)
      ? campaignData?.data?.rows.map((campaign: any) => {
        if (campaign.type === CAMPAIGN_TYPES.IVR) {
          return {
            ...campaign,
            upload: campaign?.details?.ivrFileName,
          };
        } else {
          return {
            ...campaign,
            upload: campaign?.details?.message || campaign?.details?.body,
          };
        }
      })
      : [];

    return result;
  }, [isSuccess, campaignData?.data]);

  React.useEffect(() => {
    setTableData(campaignTableData);
  }, [campaignTableData]);

  const filterData: any = (id: string, key?: string) => {
    const lowerCaseId = id.toLowerCase();

    return campaignData?.data.rows
      ?.filter((item: any) => {
        if (key === 'type' && item?.transport.toLowerCase() === lowerCaseId) {
          return true;
        }
        if (key === 'status' && item?.status.toLowerCase() === lowerCaseId) {
          return true;
        }
        return false;
      })
      ?.map((item: any) => {
        return {
          ...item,
          upload:
            item?.transport.toLowerCase() === CAMPAIGN_TYPES.IVR.toLowerCase()
              ? item?.details?.ivrFileName
              : item?.details?.message || item?.details?.body,
        };
      });
  };

  const handleFilter = (id: string, key?: string) => {
    let filteredData;
    if (!key) {
      filteredData = filterData(id);
    } else {
      filteredData = filterData(id, key);
    }
    setTableData(filteredData);
  };

  const table = useReactTable({
    data: data || [],
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
            placeholder="Search Campaign Name"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex  gap-2">
            {/* filter by campaign  */}
            <Select onValueChange={(e) => handleFilter(e, 'status')}>
              <SelectTrigger className="max-w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="FAILED">FAILED</SelectItem>
              </SelectContent>
            </Select>

            {/* filter by type  */}
            <Select
              defaultValue="Email"
              onValueChange={(e) => handleFilter(e, 'type')}
            >
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
        </div>
        <div className="mt-1 bg-card border rounded-t">
          <Table>
            <ScrollArea className="h-[calc(100vh-381px)]">
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
        <div className="flex items-center justify-end space-x-8 p-2 border-t-0 border rounded-b bg-card">
          {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
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
