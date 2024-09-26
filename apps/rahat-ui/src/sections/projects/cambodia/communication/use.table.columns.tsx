import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'sendTo',
      header: 'Send To',
      cell: ({ row }) => <div>{row.getValue('Sent To')}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <div>{row.getValue('date')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
  ];
  return columns;
};
