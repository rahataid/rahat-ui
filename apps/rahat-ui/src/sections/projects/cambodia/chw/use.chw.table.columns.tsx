import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useCambodiaChwTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'koboUsername',
      header: 'Kobo Username',
      cell: ({ row }) => <div>{row.getValue('koboUsername')}</div>,
    },
    // {
    //   accessorKey: 'home visit',
    //   header: 'Home Visit',
    //   cell: ({ row }) => <div> {row?.original?._count?.HOME_VISIT} </div>,
    // },
    {
      accessorKey: 'Sales',
      header: 'Sales Count',
      cell: ({ row }) => <div> {row?.original?._count?.SALE} </div>,
    },
    {
      accessorKey: 'leads Provided',
      header: 'Leads Provided',
      cell: ({ row }) => <div> {row?.original?._count?.LEAD} </div>,
    },
    {
      accessorKey: 'lead Conversion',
      header: 'Leads Converted',
      cell: ({ row }) => <div> {row?.original?._count?.LeadConversions} </div>,
    },
    // {
    //   accessorKey: 'phone',
    //   header: 'Phone',
    //   cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    // },

    {
      accessorKey: 'vendor',
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
