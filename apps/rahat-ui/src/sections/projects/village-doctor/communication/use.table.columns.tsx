import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export const useTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'to',
      accessorFn: (row) => row.address,
      header: 'Send To',
      cell: ({ row }) => <div>{row.original.address}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const formattedDate = date.toLocaleDateString();

        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
  ];
  return columns;
};
