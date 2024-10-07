import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useCambodiaVendorsTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.original.User.name}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.original.User.phone}</div>,
    },
    {
      accessorKey: 'wallet',
      header: 'Wallet Address',
      cell: ({ row }) => <div>{row.original.User.wallet}</div>,
    },
    {
      accessorKey: 'isVerified',
      header: 'Approved Status',
      cell: ({ row }) => (
        <Badge>
          {row.original.Project.status === 'active'
            ? 'Approved'
            : 'Not Approved'}
        </Badge>
      ),
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
                  `/projects/el-cambodia/${id}/vendors/${row.original.vendorId}`,
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
