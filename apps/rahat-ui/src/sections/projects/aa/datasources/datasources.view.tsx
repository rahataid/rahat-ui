'use client';

import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import DataSourcesTable from "./datasources.table";
import { useDataSourcesTableColumns } from "./useDataSourcesColumns";
import { useAASources, useDeleteDataSource } from "@rahat-ui/query";
import { useParams } from "next/navigation";
import { UUID } from "crypto";

export default function DataSourcesView() {
  const { id } = useParams()
  const columns = useDataSourcesTableColumns()
  const { data: tableData } = useAASources(id as UUID)

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onRowSelectionChange: setRowSelection,
    // onColumnVisibilityChange: setColumnVisibility,
    // state: {
    // rowSelection,
    // columnVisibility,
    // },
  });
  return (
    <>
      <DataSourcesTable table={table} />
    </>
  );
}
