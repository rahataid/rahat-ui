import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export const useHourlyAndDailyTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('date')}</div>,
    },
    {
      accessorKey: 'min',
      header: 'Min',
      cell: ({ row }) => <div>{row.getValue('min')}</div>,
    },
    {
      accessorKey: 'max',
      header: 'Max',
      cell: ({ row }) => <div>{row.getValue('max')}</div>,
    },
    {
      accessorKey: 'average',
      header: 'Average',
      cell: ({ row }) => <div>{row.getValue('average')}</div>,
    },
  ];
  return columns;
};
