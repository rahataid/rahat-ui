import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useElkenyaVendorsTableColumns = () => {
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
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => <div>{row.getValue('Location')}</div>,
    },
    {
      accessorKey: 'beneficiaryAssigned',
      header: 'Beneficiary Assigned',
      cell: ({ row }) => <div>{row.getValue('beneficiaryAssigned')}</div>,
    },
    {
      accessorKey: 'voucherAssigned',
      header: 'Voucher Assigned',
      cell: ({ row }) => <div>{row.getValue('voucherAssigned')}</div>,
    },
    {
      accessorKey: 'voucherRedeemed',
      header: 'Voucher Redeemed',
      cell: ({ row }) => <div>{row.getValue('voucherRedeemed')}</div>,
    },
    {
      accessorKey: 'voucherReimbursed',
      header: 'Voucher Reimbursed',
      cell: ({ row }) => <div>{row.getValue('voucherReimbursed')}</div>,
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
                  `/projects/el-kenya/${id}/vendors/${row.original.uuid}`,
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
