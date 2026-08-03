import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { convertToLocalTimeOrMillisecond } from 'apps/rahat-ui/src/utils/dateFormate';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useTranslations } from 'next-intl';

export const useHourlyAndDailyTableColumns = () => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: tg('DATE'),
      cell: ({ row }) => {
        const getDateAndTime = row.getValue('datetime') as string;
        const result = convertToLocalTimeOrMillisecond(
          getDateAndTime,
          'MMMM d, yyyy, h:mm:ss a',
        ) as { formatted: string; timestamp: number } | '';
        if (!result) return <div></div>;

        return (
          <div>{formatDate(result.timestamp, 'MMMM d, yyyy, h:mm:ss a')}</div>
        );
      },
    },
    {
      accessorKey: 'min',
      header: t('MIN'),
      cell: ({ row }) => <div>{formatNum(row.getValue('min')) || tg('N_A')}</div>,
    },
    {
      accessorKey: 'max',
      header: t('MAX'),
      cell: ({ row }) => <div>{formatNum(row.getValue('max')) || tg('N_A')}</div>,
    },
    {
      accessorKey: 'value',
      header: t('AVERAGE'),
      cell: ({ row }) => <div>{formatNum(row.getValue('value'))}</div>,
    },
  ];
  return columns;
};
