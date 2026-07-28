import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export type CreditRow = {
  date: string;
  transportName: string;
  transportType: string;
  credits: number;
  sessions: number;
  broadcasts: number;
};

export function useCreditColumns() {
  const t = useTranslations('Usage');
  const g = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const creditColumns: ColumnDef<CreditRow>[] = [
    {
      accessorKey: 'date',
      header: g('DATE'),
      cell: ({ row }) => {
        const date = row.getValue('date') as string;
        return format(new Date(date), 'MMM dd, yyyy');
      },
    },
    {
      accessorKey: 'transportName',
      header: g('TRANSPORT'),
    },
    {
      accessorKey: 'transportType',
      header: g('TYPE'),
    },
    {
      accessorKey: 'credits',
      header: t('CREDITS'),
      cell: ({ row }) => formatNum(row.getValue('credits')),
    },
    {
      accessorKey: 'sessions',
      header: t('SESSIONS'),
      cell: ({ row }) => formatNum(row.getValue('sessions')),
    },
    {
      accessorKey: 'broadcasts',
      header: t('BROADCASTS'),
      cell: ({ row }) => formatNum(row.getValue('broadcasts')),
    },
  ];

  return creditColumns;
}
