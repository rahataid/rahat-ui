import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { roundValue } from '../components/aws/utils/color.utils';
import { useTranslations } from 'next-intl';

export const useTemperatureTableColumns = (
  unit = '°C',
  label?: string,
) => {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();
  const resolvedLabel = label ?? t('TEMPERATURE_LABEL');
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'datetime',
      header: t('DATE_AND_TIME'),
      cell: ({ row }) => {
        const getDateAndTime = row.getValue('datetime') as string;
        const formatted = formatDate(
          getDateAndTime,
          'eee, MMM d yyyy, hh:mm:ss a',
        );

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: 'value',
      header: `${resolvedLabel} (${unit})`,
      cell: ({ row }) => {
        const val = row.getValue('value') as number;
        return (
          <div>
            {val !== undefined && val !== null
              ? `${formatNum(roundValue(val))} ${unit}`
              : 'N/A'}
          </div>
        );
      },
    },
  ];
  return columns;
};
