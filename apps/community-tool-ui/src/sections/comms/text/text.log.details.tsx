'use client';
import { useParams } from 'next/navigation';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  CircleEllipsisIcon,
  Mail,
  MessageCircle,
  PhoneCall,
  Settings,
} from 'lucide-react';
import { TriggerConfirmModal } from './confirm.modal';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import useTextTableColumn from './useTextTableColumn';
import { useMemo, useState } from 'react';
import { usePagination } from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  TableHeader,
  Table as TableComponent,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '@rahat-ui/shadcn/src/components/ui/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import Image from 'next/image';
import {
  useLisBeneficiaryComm,
  useListCommsLogsId,
} from '@rahat-ui/community-query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function TextLogDetails() {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();
  const { campaignId } = useParams();
  const columns = useTextTableColumn();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { data: campginData } = useLisBeneficiaryComm(campaignId as string);
  console.log(campginData);
  const { data, isSuccess, isLoading } = useListCommsLogsId(
    campaignId as string,
    {
      ...pagination,
      ...(filters as any),
    },
  );

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

  // const handleFilterChange = (event: any) => {
  //   if (event && event.target) {
  //     const { name, value } = event.target;
  //     table.getColumn(name)?.setFilterValue(value);
  //     setFilters({
  //       ...filters,
  //       [name]: value,
  //     });
  //   }
  //   setPagination({
  //     ...pagination,
  //     page: 1,
  //   });
  // };

  // useEffect(() => {
  //   setFilters({
  //     name: '',
  //   });
  // }, [pathName, setFilters]);

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
        {/* <div className="flex items-center mb-2">
          <Input
            placeholder="Filter Communication Log..."
            name="to"
            value={
              (table.getColumn('to')?.getFilterValue() as string) ?? filters?.to
            }
            onChange={(event) => handleFilterChange(event)}
            className="rounded "
          />
        </div> */}
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

                          {/* <Button
                className="flex items-center gap-3"
                onClick={() =>
                  router.push(`/projects/rp/${id}/beneficiary/add`)
                }
              >
                <Settings size={18} strokeWidth={1.5} />
                Manage
              </Button> */}
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
