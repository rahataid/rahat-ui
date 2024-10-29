import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface VendorTableProps {
  handleViewClick: any;
}

export const useElkenyaVendorsTableColumns = ({
  handleViewClick,
}: VendorTableProps) => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'BeneficiaryRedemption',
      header: 'Voucher Redeemed',
      cell: ({ row }) => <div>{row.getValue('BeneficiaryRedemption')}</div>,
    },
    {
      accessorKey: 'TokenRedemption',
      header: 'Voucher Reimbursed',
      cell: ({ row }) => <div>{row.getValue('TokenRedemption')}</div>,
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
              onClick={() => handleViewClick(row.original)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
