import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export default function useCommsLogsTableColumns() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'audience',
      header: 'Audience',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('audience')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
    {
      accessorKey: 'attempts',
      header: 'Attempts',
      cell: ({ row }) => <div>{row.getValue('attempts')}</div>,
    },
    {
      accessorKey: 'timeStamp',
      header: 'Time Stamp',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('timeStamp')).toLocaleTimeString()}</div>
      ),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => <div>{row.getValue('duration')}</div>,
    },
  ];
  return columns;
}
