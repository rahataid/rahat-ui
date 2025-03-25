import { Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

interface BeneficiaryTableProps {
  handleViewClick: any;
}
export const useBeneficiaryTableColumns = ({
  handleViewClick,
}: BeneficiaryTableProps) => {
  const { id } = useParams();
  const router = useRouter();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Beneficiary Type',
      cell: ({ row }) => {
        const beneficiaryType = row.getValue('type');
        return (
          <div>
            <Badge>{(beneficiaryType as string) || 'N/A'}</Badge>
            {row?.original?.extras?.serialNumber && (
              <p className="text-gray-400">Physical Voucher</p>
            )}
            {!!row?.original?.graphData?.otpAddeds?.length && (
              <p className="text-gray-400">Offline</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.extras?.location ||
              row?.original?.projectData?.location ||
              'N/A'}
          </div>
        );
      },
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
