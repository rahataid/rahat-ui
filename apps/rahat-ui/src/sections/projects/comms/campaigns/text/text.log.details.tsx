'use client';

import {
  CircleEllipsisIcon,
  Mail,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  useGetRpCampaign,
  useListRpCampaignLog,
  usePagination,
} from '@rahat-ui/query';
import {
  TableHeader,
  Table as TableComponent,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '@rahat-ui/shadcn/src/components/ui/table';

import { UUID } from 'crypto';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { TriggerConfirmModal } from './confirm.modal';
import useTextTableColumn from '../../useTableColumn';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function TextLogDetails() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    filters,
  } = usePagination();
  const { id, campaignId } = useParams();
  const columns = useTextTableColumn();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { data: campginData } = useGetRpCampaign(id as UUID, campaignId);
  const { data, isSuccess, isLoading } = useListRpCampaignLog(id as UUID, {
    uuid: campaignId as string,
    query: {
      ...pagination,
      ...(filters as any),
    },
  });

  const tableData = useMemo(() => {
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
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <div className="w-full p-2 bg-secondary">
      <div className="flex items-center justify-between mb-2 mx-2">
        <p className="font-medium	text-neutral-800 text-lg">
          {campginData?.data?.name}
        </p>
        {!campginData?.data?.sessionId ? (
          <TriggerConfirmModal campaignId={campaignId as string} />
        ) : null}
      </div>
      <div className=" grid sm:grid-cols-1 md:grid-cols-3 gap-2 mb-2 mx-2">
        <DataCard className="" title="Text" number={'10'} Icon={PhoneCall} />
        <DataCard
          title="Beneficiaries"
          // number={data?.audiences.length?.toString() || '0'}
          number={'0'}
          Icon={Mail}
        />
        <DataCard
          title="Successful Message Delivered"
          number={'09'}
          Icon={MessageCircle}
        />
      </div>

      <div className="w-full -mt-2 p-2 bg-secondary">
        <div className="rounded border bg-card">
          <TableComponent>
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
                      data?.response?.meta?.lastPage === pagination.page
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TableFooter>
          </TableComponent>
        </div>
      </div>
    </div>
  );
}
