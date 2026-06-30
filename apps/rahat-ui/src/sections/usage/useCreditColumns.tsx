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

export const creditColumns: ColumnDef<CreditRow>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return format(new Date(date), 'MMM dd, yyyy');
    },
  },
  {
    accessorKey: 'transportName',
    header: 'Transport',
  },
  {
    accessorKey: 'transportType',
    header: 'Type',
  },
  {
    accessorKey: 'credits',
    header: 'Credits',
  },
  {
    accessorKey: 'sessions',
    header: 'Sessions',
  },
  {
    accessorKey: 'broadcasts',
    header: 'Broadcasts',
  },
];
