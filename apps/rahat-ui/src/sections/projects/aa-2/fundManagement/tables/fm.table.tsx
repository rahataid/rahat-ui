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
import { useFundManagementTableColumns } from '../columns/useFMColumns';
import { IFundManagement } from '../types';

interface IProps {
  fmList: IFundManagement[];
  loading?: boolean;
}

export default function FundManagementList({ fmList, loading }: IProps) {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useFundManagementTableColumns();
  const table = useReactTable({
    data: fmList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  return (
    <div className="">
      <Heading
        title="Fund Management List"
        titleStyle="text-lg"
        description="List of all the funds created"
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
          fmList?.length > 0 ? 'h-[calc(100vh-420px)]' : 'h-[calc(100vh-800px)]'
        }
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
