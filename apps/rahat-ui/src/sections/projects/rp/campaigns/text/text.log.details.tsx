'use client';

import { useCampaignStore } from '@rahat-ui/query';
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
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useGetCampaign } from '@rumsan/communication-query';
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
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Mail, MessageCircle, PhoneCall, Settings } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { TriggerConfirmModal } from './confirm.modal';
import useTextTableColumn from './useTextTableColumn';
export type Text = {
  id: number;
  to: string;
  date: string;
  status: string;
};

export default function TextLogDetails() {
  const campaignStore = useCampaignStore();
  const columns = useTextTableColumn();
  const { campaignId } = useParams();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isSuccess, isFetching } = useGetCampaign({
    id: Number(campaignId),
  });

  const tableData = React.useMemo(() => {
    if (isSuccess && data?.data) {
      return data?.data?.communicationLogs?.map((item: any) => ({
        date: new Date(item.createdAt).toLocaleString(),
        status: item?.status,
        to:
          item?.type === CAMPAIGN_TYPES.EMAIL
            ? item?.details?.envelope?.to
            : item?.details?.to,
      }));
    } else {
      return [];
    }
  }, [data, isSuccess]);

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
      <div className="flex items-center justify-between mb-4">
        <p className="font-medium	text-neutral-800 text-lg">
          {data?.data?.name}
        </p>
        {data?.data?.status !== 'COMPLETED' ? (
          <TriggerConfirmModal id={Number(campaignId)} />
        ) : null}
      </div>
      <div className=" grid sm:grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <DataCard className="" title="Text" number={'10'} Icon={PhoneCall} />
        <DataCard
          title="Beneficiaries"
          number={data?.data?.audiences.length?.toString() || '0'}
          Icon={Mail}
        />
        <DataCard
          title="Successful Message Delivered"
          number={'09'}
          Icon={MessageCircle}
        />
      </div>
      <div className="flex items-center mt-2 mb-2 gap-2">
        <Input
          placeholder="Filter communication..."
          value={(table.getColumn('to')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('to')?.setFilterValue(event.target.value)
          }
          className="max-w-mx"
        />
      </div>
      <div className="rounded border bg-card">
        {table.getRowModel().rows?.length ? (
          <>
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
                        {isFetching && (
                          <div className="flex items-center justify-center space-x-2 h-full">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </ScrollArea>
            </Table>
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
          </>
        ) : (
          <div className="w-full h-[calc(100vh-310px)]">
            <div className="flex flex-col items-center justify-center">
              <Image src="/noData.png" height={250} width={250} alt="no data" />
              <p className="text-medium text-base mb-1">No Data Available</p>
              <p className="text-sm mb-4 text-gray-500">
                There are no logs at the moment.
              </p>
              <Button
                className="flex items-center gap-3"
                onClick={() =>
                  router.push(`/projects/rp/${id}/beneficiary/add`)
                }
              >
                <Settings size={18} strokeWidth={1.5} />
                Manage
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
