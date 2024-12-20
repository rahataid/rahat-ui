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
  useGetCommsCampaign,
  useListCommsCampaignLog,
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
import CommsTable from '../../table.component';

export type Ivr = {
  id: number;
  to: string;
  date: string;
  duration: string;
  status: string;
};

export default function IvrLogDetails() {
  const { pagination, setNextPage, setPrevPage, filters } = usePagination();
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

  const { data: campginData } = useGetCommsCampaign(
    id as UUID,
    campaignId as string,
  );
  const { data, isSuccess, isLoading } = useListCommsCampaignLog(id as UUID, {
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
      <CommsTable table={table} tableHeight="h-[calc(100vh-421px)]" />
    </div>
  );
}
