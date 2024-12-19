import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useCambodiaChwTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Health Worker Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'koboUsername',
      header: 'Kobo Username',
      cell: ({ row }) => <div>{row.getValue('koboUsername')}</div>,
    },

    {
      accessorKey: 'Sales',
      header: 'Sales',
      cell: ({ row }) => <div> {row?.original?._count?.SALE} </div>,
    },
    {
      accessorKey: 'villagers referred',
      header: 'Villagers Referred',
      cell: ({ row }) => <div> {row?.original?._count?.LEAD} </div>,
    },
    {
      accessorKey: 'eye checkup',
      header: 'Eye Checkup',
      cell: ({ row }) => <div> {row?.original?._count?.LeadConversions} </div>,
    },
    // {
    //   accessorKey: 'phone',
    //   header: 'Phone',
    //   cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    // },

    {
      accessorKey: 'vision center',
      accessorFn: (row) => row.vendor,
      header: 'Vision Center',
      cell: ({ row }) => <div> {row?.original?.vendor?.name} </div>,
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
                  `/projects/el-cambodia/${id}/chw/${row.original.uuid}`,
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
