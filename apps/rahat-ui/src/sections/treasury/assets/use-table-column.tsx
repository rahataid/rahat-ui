import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const useAssetsTableColumn = () => {
  const columns: ColumnDef<Assets>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{row.getValue('amount')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return status === 'Paid' ? (
          <Badge className="bg-green-200 text-green-600">Paid</Badge>
        ) : (
          <Badge className="bg-red-200 text-red-600">Pending</Badge>
        );
      },
    },

    {
      id: 'actions',
      enableHiding: true,
      cell: () => {
        return (
          <Eye
            //   onClick={() => route.push(`/treasury/assets/${id}`)}
            className="cursor-pointer"
            size={18}
            strokeWidth={1.5}
          />
        );
      },
    },
  ];
  return columns;
};
