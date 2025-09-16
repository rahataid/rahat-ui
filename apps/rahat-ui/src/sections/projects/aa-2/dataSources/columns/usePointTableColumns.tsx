import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';

interface UsePointTableColumnsProps {
  unit?: string;
}

export const usePointTableColumns = ({ unit }: UsePointTableColumnsProps) => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: 'Date',
      cell: ({ row }) => {
        const dateTime = row.getValue('datetime') as string;
        const { formatted } = convertToLocalTimeOrMillisecond(
          dateTime,
          'eee, MMMM d, yyyy, h:mm:ss',
        ) as { formatted: string; timestamp: number };

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'value',
      header: 'Point',
      cell: ({ row }) => (
        <div>
          {row.getValue('value')} {unit}
        </div>
      ),
    },
  ];
  return columns;
};
