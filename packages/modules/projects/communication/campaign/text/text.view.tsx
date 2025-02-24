import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useListCommsCommunicationLogs, usePagination } from 'libs/query/src';
import { UUID } from 'crypto';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import useTextTableColumn from './useTableColumn';
import {
  CustomPagination,
  DataCard,
  DemoTable,
  IconLabelBtn,
  SearchInput,
  ToggleColumns,
} from 'packages/modules';
import { Mail, MessageCircle, PhoneCall, Settings } from 'lucide-react';

export default function TextView() {
  const { id } = useParams();
  const router = useRouter();

  const columns = useTextTableColumn();

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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2 bg-secondary grid gap-2">
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-2">
        <DataCard title="Voice" number="16" Icon={PhoneCall} />
        <DataCard title="Beneficiaries" number="240" Icon={Mail} />
        <DataCard title="Successful Calls" number="25" Icon={MessageCircle} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <SearchInput
          name="communication"
          onSearch={(event) =>
            table.getColumn('to')?.setFilterValue(event.target.value)
          }
        />
        <ToggleColumns table={table} />
        <IconLabelBtn
          Icon={Settings}
          name="Manage"
          handleClick={() =>
            router.push(`/projects/comms/${id}/campaigns/text/manage`)
          }
        />
      </div>
      <DemoTable table={table} tableHeight="h-[calc(100vh-321px)]" />
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
