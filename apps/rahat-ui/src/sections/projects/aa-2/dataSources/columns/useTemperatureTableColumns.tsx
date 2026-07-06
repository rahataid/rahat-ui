import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { roundValue } from '../components/aws/utils/color.utils';

export const useTemperatureTableColumns = (
  unit = '°C',
  label = 'Temperature',
) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date & Time',
      cell: ({ row }) => {
        const getDateAndTime = row.getValue('datetime') as string;
        const formatted = dateFormat(
          getDateAndTime,
          'eee, MMM d yyyy, hh:mm:ss a',
        );

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'value',
      header: `${label} (${unit})`,
      cell: ({ row }) => {
        const val = row.getValue('value') as number;
        return (
          <div>
            {val !== undefined && val !== null
              ? `${roundValue(val)} ${unit}`
              : 'N/A'}
          </div>
        );
      },
    },
  ];
  return columns;
};
