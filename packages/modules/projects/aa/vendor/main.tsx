import React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useProjectVendorTableColumns } from './table.columns';
import { projectVendors } from './static';
import {
  SearchInput,
  DemoTable,
  ClientSidePagination,
  PageHeading,
} from 'packages/modules';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useProjectVendorTableColumns();

  const table = useReactTable({
    data: projectVendors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
    },
  });
  return (
    <>
      <div className="p-4">
        <PageHeading
          title="Vendors"
          description="Track all the vendor reports here"
        />
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name=""
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onSearch={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
            />
          </div>
          <DemoTable table={table} tableHeight="h-[calc(100vh-310px)]" />
          <ClientSidePagination table={table} />
        </div>
      </div>
    </>
  );
}
