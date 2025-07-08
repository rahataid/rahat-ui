import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

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
        const formatedDate = dateFormat(dateTime);
        return <div>{formatedDate}</div>;
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
