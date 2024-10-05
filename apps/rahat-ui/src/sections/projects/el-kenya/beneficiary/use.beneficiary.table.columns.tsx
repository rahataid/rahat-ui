import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface BeneficiaryTableProps {
  handleViewClick: any;
}
export const useElkenyaBeneficiaryTableColumns = ({
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
      accessorKey: 'voucherType',
      header: 'Voucher Type',
      cell: ({ row }) => <div>{row.getValue('voucherType') || 'N/A'}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Beneficiary Type',
      cell: ({ row }) => <div>{row.getValue('type')}</div>,
    },
    {
      accessorKey: 'eyeCheckupStatus',
      header: 'Eye Checkup Status',
      cell: ({ row }) => <div>{row.getValue('eyeCheckupStatus')}</div>,
    },
    {
      accessorKey: 'glassesStatus',
      header: 'Glasses Status',
      cell: ({ row }) => <div>{row.getValue('glassesStatus')}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => {
        console.log('row', row);
        return <div>{row.getValue('voucherStatus')}</div>;
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
