import React from 'react';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import {
  ClientSidePagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'packages/modules';
import { useFMDetailTableColumns } from '../columns/useFMDetailColumns';

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
  return (
    <div className="border rounded-md p-4">
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
        tableHeight={
          group?.length > 0 ? 'h-[calc(100vh-420px)]' : 'h-[calc(100vh-800px)]'
        }
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
