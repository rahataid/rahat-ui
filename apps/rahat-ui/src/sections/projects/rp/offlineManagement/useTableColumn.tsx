import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye, Pencil } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useTableColumn = () => {
  const route = useRouter();
  const { id, bid } = useParams();

  type Payment = {
    id: string;
    vendor: string;
    beneficiary: number;
    tokenAssigned: number;
  };

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Vendor',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: '_count.offlineBeneficiaries', // Notice the plural form here
      header: 'Offline Beneficiary Assigned',
      cell: ({ getValue }) => (
        <div className="capitalize">
          {getValue('_count.offlineBeneficiaries')}
        </div>
      ),
    },
    {
      accessorKey: 'totalAmountAssigned',
      header: 'Token Assigned',
      cell: ({ row }) => (
        <div className="capitalize">
          {Number(row.getValue('totalAmountAssigned'))}
        </div>
      ),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <div className="flex items-center gap-4">
            <Eye
              onClick={() =>
                route.push(
                  `/projects/rp/${id}/offlineManagement/${row.original.id}`,
                )
              }
              className="cursor-pointer"
              size={20}
              strokeWidth={1.5}
            />
            <Pencil
              className="cursor-pointer text-primary"
              size={20}
              strokeWidth={1.5}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
