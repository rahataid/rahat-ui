import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

export type CreditRow = {
  date: string;
  transportName: string;
  transportType: string;
  credits: number;
  sessions: number;
  broadcasts: number;
};

export function useCreditColumns() {
  const t = useTranslations('USAGE');
  const g = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();

  const creditColumns: ColumnDef<CreditRow>[] = [
    {
      accessorKey: 'date',
      header: g('DATE'),
      cell: ({ row }) => {
        const date = row.getValue('date') as string;
        return formatDate(date, 'MMM dd, yyyy');
      },
      footer: () => g('TOTAL'),
    },
    {
      accessorKey: 'transportName',
      header: g('TRANSPORT'),
      cell: ({ row }) => translateValue(g, row.getValue('transportName')),
      footer: () => null,
    },
    {
      accessorKey: 'transportType',
      header: g('TYPE'),
      cell: ({ row }) => translateValue(g, row.getValue('transportType')),
      footer: () => null,
    },
    {
      accessorKey: 'credits',
      header: t('CREDITS'),
      cell: ({ row }) => formatNum(row.getValue('credits')),
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + (row.original.credits || 0), 0);
        return formatNum(total);
      },
    },
    {
      accessorKey: 'sessions',
      header: t('SESSIONS'),
      cell: ({ row }) => formatNum(row.getValue('sessions')),
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + (row.original.sessions || 0), 0);
        return formatNum(total);
      },
    },
    {
      accessorKey: 'broadcasts',
      header: t('BROADCASTS'),
      cell: ({ row }) => formatNum(row.getValue('broadcasts')),
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + (row.original.broadcasts || 0), 0);
        return formatNum(total);
      },
    },
  ];

  return creditColumns;
}
