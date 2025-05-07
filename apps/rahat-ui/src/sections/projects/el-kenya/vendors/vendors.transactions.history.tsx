import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaVendorsTransactionsTableColumns } from './columns/use.vendors.transactions.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import ClientSidePagination from '../../components/client.side.pagination';

export default function VendorsTransactionsHistory({
  tableData,
  loading,
}: {
  tableData: any;
  loading?: boolean;
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  console.log('loading', tableData);

  const columns = useElkenyaVendorsTransactionsTableColumns();
  const table = useReactTable({
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility,
    },
  });
  return (
    <div className="p-4 border rounded-sm">
      <ElkenyaTable
        table={table}
        tableHeight="h-[calc(100vh-380px)]"
        loading={loading}
      />
      <ClientSidePagination table={table} />
    </div>
  );
}
