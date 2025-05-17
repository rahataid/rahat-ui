import React from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useFMDetailTableColumns } from '../columns/useFMDetailColumns';
import {
  ClientSidePagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';

interface IProps {
  group: any[];
  loading?: boolean;
  title: string;
}

export default function FundManagementDetailTable({
  group,
  loading,
  title,
}: IProps) {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const columns = useFMDetailTableColumns();
  const table = useReactTable({
    data: group || [],
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
    },
  });
  console.log('single', group);

  return (
    <div className="border rounded-sm p-4">
      <Heading
        title={title}
        titleStyle="text-lg"
        description="List of all the beneficiaries in the group"
      />
      <SearchInput
        className="w-full mb-2"
        name="walletAddress"
        value={
          (table.getColumn('walletAddress')?.getFilterValue() as string) ?? ''
        }
        onSearch={(event) =>
          table.getColumn('walletAddress')?.setFilterValue(event.target.value)
        }
      />
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-550px)]"
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
