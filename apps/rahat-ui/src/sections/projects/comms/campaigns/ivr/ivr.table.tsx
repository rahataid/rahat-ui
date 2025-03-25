'use client';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
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
  PhoneCall,
  Settings,
  Settings2,
} from 'lucide-react';

import Image from 'next/image';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import useIvrTableColumn from '../../useTableColumn';
import { Input } from '@rahat-ui/shadcn/components/input';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Button } from '@rahat-ui/shadcn/components/button';
import CommsTable from '../../table.component';
import { useListCommsCommunicationLogs, usePagination } from '@rahat-ui/query';
import { UUID } from 'crypto';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export type Ivr = {
  id: number;
  to: string;
  date: string;
  duration: string;
  status: string;
};

export default function IvrTable() {
  const columns = useIvrTableColumn();
  const { id } = useParams();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();

  const logs = useListCommsCommunicationLogs(id as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    limit: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
  });
  const meta = logs.data?.response.meta;

  const table = useReactTable({
    data: logs?.data?.data || [],
    manualPagination: true,
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
      <div className=" grid sm:grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <DataCard
          className=""
          title="Voice"
          // number={totalVoiceMessage.toString()}
          number={'16'}
          Icon={PhoneCall}
        />
        <DataCard
          className=""
          title="Beneficiaries"
          number={'240'}
          // number={totalBeneficiary.toString()}
          Icon={Mail}
        />
        <DataCard
          className=""
          title="Successful Calls"
          number={'25'}
          // number={deliveredVoiceMessage.toString()}
          Icon={MessageCircle}
        />
      </div>
      <div className="flex items-center mt-4 mb-2 gap-2">
        <Input
          placeholder="Filter communication..."
          value={(table.getColumn('to')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('to')?.setFilterValue(event.target.value)
          }
          className="max-w-mx"
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
        {table.getRowModel().rows?.length > 0 ? (
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              router.push(`/projects/comms/${id}/campaigns/ivr/manage`);
            }}
          >
            <Settings size={18} strokeWidth={1.5} />
            Manage
          </Button>
        ) : null}
      </div>
      <CommsTable table={table} tableHeight="h-[calc(100vh-321px)]" />
      <CustomPagination
        meta={meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={0}
      />
    </div>
  );
}
