import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';

export const useHourlyAndDailyTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date',
      cell: ({ row }) => {
        const getDateAndTime = row.getValue('datetime') as string;
        const { formatted } = convertToLocalTimeOrMillisecond(
          getDateAndTime,
          'MMMM d, yyyy, h:mm:ss a',
        ) as { formatted: string; timestamp: number };

        return <div>{formatted}</div>;
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
