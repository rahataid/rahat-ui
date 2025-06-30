import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

export const useHourlyAndDailyTableColumns = () => {
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
      accessorKey: 'min',
      header: 'Min',
      cell: ({ row }) => <div>{row.getValue('min') || 'N/A'}</div>,
    },
    {
      accessorKey: 'max',
      header: 'Max',
      cell: ({ row }) => <div>{row.getValue('max') || 'N/A'}</div>,
    },
    {
      accessorKey: 'value',
      header: 'Average',
      cell: ({ row }) => <div>{row.getValue('value')}</div>,
    },
  ];
  return columns;
};
