'use client';


import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import {
  useGetRpCampaign,
  useListRpCampaignLog,
  usePagination,
} from '@rahat-ui/query';
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
  CircleEllipsisIcon,
  Mail,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';

import { UUID } from 'crypto';
import Image from 'next/image';
import * as React from 'react';
import { TriggerConfirmModal } from './confirm.moda';
import { useParams, useRouter } from 'next/navigation';
import useIvrTableColumn from './useIvrTableColumn';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Button } from '@rahat-ui/shadcn/components/button';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';


export type Ivr = {
  id: number;
  to: string;
  date: string;
  duration: string;
  status: string;
};

export default function IvrLogDetails() {
  const {
    pagination,
    setNextPage,
    setPrevPage,
    filters,
  } = usePagination();
  const { id, campaignId } = useParams();
  const columns = useIvrTableColumn();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: campginData } = useGetRpCampaign(
    id as UUID,
    campaignId as string,
  );
  const { data, isSuccess, isLoading } = useListRpCampaignLog(id as UUID, {
    uuid: campaignId as string,
    query: {
      ...pagination,
      ...(filters as any),
    },
  });

  const tableData = React.useMemo(() => {
    if (isSuccess && data) {
      return data?.data?.map((item: any) => ({
        date: new Date(item.createdAt).toLocaleString(),
        status: item?.status,
        to: item?.address,
      }));
    } else {
      return [];
    }
  }, [data, isSuccess]);

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
    <div className="w-full h-full p-2 bg-secondary">
      <div className="flex items-center justify-between mb-2 mx-2">
        <p className="font-medium	text-neutral-800 text-lg">
          {campginData?.data?.name}
        </p>
        {!campginData?.data?.sessionId ? (
          <TriggerConfirmModal
            campaignId={campaignId as string}
            uuid={campginData?.data?.uuid}
          />
        ) : null}
      </div>
      <div className=" grid sm:grid-cols-1 md:grid-cols-3 gap-2">
        <DataCard className="" title="Voice" number={'10'} Icon={PhoneCall} />
        <DataCard
          className=""
          title="Beneficiaries"
          number={'20'}
          Icon={Mail}
        />
        <DataCard
          className=""
          title="Successful Calls"
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
        <Table>
          <ScrollArea className="h-[calc(100vh-370px)]">
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
              {table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row, key) => (
                  <TableRow
                    key={key}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={index}>
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
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center mt-4">
                        <div className="text-center">
                          <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
                          <Label className="text-base">Loading ...</Label>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src="/noData.png"
                          height={250}
                          width={250}
                          alt="no data"
                        />
                        <p className="text-medium text-base mb-1">
                          No Data Available
                        </p>
                        <p className="text-sm mb-4 text-gray-500">
                          There are no logs at the moment.
                        </p>

                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
          <TableFooter>
            <div className="flex items-center justify-end space-x-2 p-2 border-t bg-card">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setPrevPage}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setNextPage}
                  disabled={
                    data?.response?.meta?.lastPage === pagination.page ||
                    data === undefined
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
