import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';
import { roundValue } from '../components/aws/utils/color.utils';

export const useTemperatureTableColumns = (unit = '°C') => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date & Time',
      cell: ({ row }) => {
        const getDateAndTime = row.getValue('datetime') as string;
        const dateTransformResult = convertToLocalTimeOrMillisecond(
          getDateAndTime,
          'MMM d, yyyy h:mm a',
        );

        const formatted =
          typeof dateTransformResult === 'object' &&
          dateTransformResult !== null &&
          typeof dateTransformResult.formatted === 'string' &&
          dateTransformResult.formatted !== ''
            ? dateTransformResult.formatted
            : 'N/A';

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'value',
      header: `Temperature (${unit})`,
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
