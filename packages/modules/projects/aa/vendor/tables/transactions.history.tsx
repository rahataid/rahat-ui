import React from 'react';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ClientSidePagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'packages/modules';
import { useVendorsTransactionTableColumns } from '../columns/useTransactionColumns';

export default function VendorsTransactionsHistory({
  tableData,
  loading,
}: {
  tableData: any;
  loading?: boolean;
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = useVendorsTransactionTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
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
        title="Transaction History"
        titleSize="lg"
        description="List of all the transactions made"
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
          tableData?.length > 0
            ? 'h-[calc(100vh-380px)]'
            : 'h-[calc(100vh-800px)]'
        }
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
