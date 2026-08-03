import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useTranslations } from 'next-intl';

interface UsePointTableColumnsProps {
  unit?: string;
}

export const usePointTableColumns = ({ unit }: UsePointTableColumnsProps) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: tg('DATE'),
      cell: ({ row }) => {
        const dateTime = row.getValue('datetime') as string;
        const result = convertToLocalTimeOrMillisecond(
          dateTime,
          'eee, MMMM d, yyyy, h:mm:ss',
        ) as { formatted: string; timestamp: number } | '';
        if (!result) return <div></div>;

        return (
          <div>{formatDate(result.timestamp, 'eee, MMMM d, yyyy, h:mm:ss')}</div>
        );
      },
    },
    {
      accessorKey: 'value',
      header: t('POINT'),
      cell: ({ row }) => (
        <div>
          {formatNum(row.getValue('value'))} {unit}
        </div>
      ),
    },
  ];
  return columns;
};
