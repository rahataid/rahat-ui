import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export const usePointTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date',
      cell: ({ row }) => {
        const dateTime = new Date(row.getValue('datetime'));
        const formatedDate = new Intl.DateTimeFormat('en-NP', {
          timeZone: 'Asia/Kathmandu',
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(dateTime);

        return <div>{formatedDate}</div>;
      },
    },
    {
      accessorKey: 'value',
      header: 'Point',
      cell: ({ row }) => <div>{row.getValue('value')}</div>,
    },
  ];
  return columns;
};
