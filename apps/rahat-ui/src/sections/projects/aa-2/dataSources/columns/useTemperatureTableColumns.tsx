import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';
import { roundValue } from '../components/aws/utils/color.utils';

export const useTemperatureTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date & Time',
      cell: ({ row }) => {
        const getDateAndTime = row.getValue('datetime') as string;
        const { formatted } = convertToLocalTimeOrMillisecond(
          getDateAndTime,
          'MMM d, yyyy h:mm a',
        ) as { formatted: string; timestamp: number };

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'value',
      header: 'Temperature',
      cell: ({ row }) => {
        const val = row.getValue('value') as number;
        return (
          <div>
            {val !== undefined && val !== null ? roundValue(val) : 'N/A'}
          </div>
        );
      },
    },
  ];
  return columns;
};
