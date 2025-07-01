import React from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DemoTable } from 'apps/rahat-ui/src/common';

type IProps = {
  tableData: any[];
  columns: any[];
};

export default function WaterLevelTable({ tableData, columns }: IProps) {
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <>
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-650px)] min-h-[400px]"
      />
    </>
  );
}
