import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useElkenyaBeneficiaryTableColumns = () => {
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
      cell: ({ row }) => <div>{row.getValue('voucherType')}</div>,
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
              onClick={() =>
                router.push(
                  `/projects/el-kenya/${id}/beneficiary/${row.original.uuid}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
