import { useTranslations } from 'next-intl';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

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
    },
    {
      accessorKey: 'sessions',
      header: t('SESSIONS'),
    },
    {
      accessorKey: 'broadcasts',
      header: t('BROADCASTS'),
    },
  ];

  return creditColumns;
}
