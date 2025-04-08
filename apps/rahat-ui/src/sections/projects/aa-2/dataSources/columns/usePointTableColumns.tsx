import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export const usePointTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('date')}</div>,
    },
    {
      accessorKey: 'point',
      header: 'Point',
      cell: ({ row }) => <div>{row.getValue('point')}</div>,
    },
  ];
  return columns;
};
