import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';

export default function useTableColumn() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const columns: ColumnDef<any>[] = [
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
      header: 'Vendors',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: '_count.offlineBeneficiaries',
      header: 'Offline Beneficiary Assigned',
      cell: ({ getValue }) => (
        <div className="capitalize">
          {getValue('_count.offlineBeneficiaries')}
        </div>
      ),
    },
    {
      accessorKey: 'vouchersType',
      header: 'Vouchers Type',
      cell: ({ row }) => {
        row.getValue('vouchersType');
      },
    },
    {
      accessorKey: 'syncStatus',
      header: 'Sync Status',
      cell: ({ row }) => <div>{row.getValue('syncStatus')}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() =>
                router.push(
                  `/projects/el-kenya/${id}/offline-management/${row.original.id}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
}
