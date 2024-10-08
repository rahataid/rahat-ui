import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from 'date-fns';

export const useElkenyaSMSTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'to',
      header: 'Send To',
      cell: ({ row }) => <div>{row.getValue('to') || 'N/A'}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('createdAt')).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
  ];
  return columns;
};
