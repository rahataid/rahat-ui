import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from 'libs/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useVendorsBeneficiaryTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (vendorId: string) => {
    router.push(`/projects/aa/${id}/vendors/${vendorId}`);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Beneficiary Name',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'tokenStatus',
      header: 'Token Status',
      cell: ({ row }) => <Badge>{row.getValue('tokenStatus') || 'N/A'}</Badge>,
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
              onClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
