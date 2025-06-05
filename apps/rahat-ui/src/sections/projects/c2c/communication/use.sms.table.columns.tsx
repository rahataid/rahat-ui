import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export const useElkenyaSMSTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'address',
      header: 'Sent To',
      cell: ({ row }) => <div>{row.getValue('address') || 'N/A'}</div>,
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
