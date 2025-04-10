import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export const usePointTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('datetime')).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Point',
      cell: ({ row }) => <div>{row.getValue('value')}</div>,
    },
  ];
  return columns;
};
