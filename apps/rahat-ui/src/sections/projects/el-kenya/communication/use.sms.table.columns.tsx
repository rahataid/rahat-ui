import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaSMSTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'to',
      header: 'Sent To',
      cell: ({ row }) => <div>{row.getValue('to') || 'N/A'}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
  ];
  return columns;
};
