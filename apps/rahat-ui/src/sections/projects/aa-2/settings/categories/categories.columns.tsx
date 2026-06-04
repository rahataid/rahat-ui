'use client';

import { ColumnDef } from '@tanstack/react-table';

interface CategoryData {
  id: string;
  name: string;
}

export const useAACategoryColumns = () => {
  const columns: ColumnDef<CategoryData>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
  ];

  return columns;
};
