import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useConsumersTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Consumer Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
    },
    {
      accessorKey: 'lastRedemptionDate',
      header: 'Last Redemption Date',
      cell: ({ row }) => {
        const value = row.getValue('lastRedemptionDate');
        return <div>{new Date(value as string).toLocaleDateString()}</div>;
      },
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Eye
    //           className="hover:text-primary cursor-pointer"
    //           size={16}
    //           strokeWidth={1.5}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];
  return columns;
};
