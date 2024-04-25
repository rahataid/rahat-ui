'use client';

import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import TriggerStatementsTable from "./trigger-statements.table";
import { useTriggerStatementTableColumns } from "./useTriggerStatementsColumns";
import { useAATriggerStatements } from "@rahat-ui/query";
import { useParams } from "next/navigation";
import { UUID } from "crypto";

export default function TriggerStatementsView() {
  const { id } = useParams()
  const columns = useTriggerStatementTableColumns()
  const { data: tableData } = useAATriggerStatements(id as UUID)

  console.log(tableData)

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
      <TriggerStatementsTable table={table} />
    </>
  );
}
