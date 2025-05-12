import React from 'react';
import {
  getCoreRowModel,
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
}

export default function FundManagementDetailTable({ group, loading }: IProps) {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useFMDetailTableColumns();
  const table = useReactTable({
    data: group || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  console.log('single', group);

  return (
    <div className="border rounded-sm p-4">
      <Heading
        title="Group Name"
        titleStyle="text-lg"
        description="List of all the beneficiaries in the group"
      />
      <SearchInput
        className="w-full"
        name=""
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
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
