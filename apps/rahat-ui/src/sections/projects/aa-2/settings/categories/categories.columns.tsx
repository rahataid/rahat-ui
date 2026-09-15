'use client';

import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';

interface CategoryData {
  id: string;
  name: string;
}

export const useAACategoryColumns = () => {
  const t = useTranslations('AA_PROJECT');
  const columns: ColumnDef<CategoryData>[] = [
    {
      header: t('NAME'),
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
  ];

  return columns;
};
