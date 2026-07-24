import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useCambodiaChwTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Village Doctor Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'koboUsername',
      header: 'Kobo Username',
      cell: ({ row }) => <div>{row.getValue('koboUsername')}</div>,
    },

    // {
    //   accessorKey: 'Sales',
    //   header: 'Sales',
    //   cell: ({ row }) => <div> {row?.original?._count?.SALE} </div>,
    // },
    {
      accessorKey: 'villagers referred',
      header: 'Total Villagers Referred',
      cell: ({ row }) => <div>{row?.original?._count?.LEAD ?? 0}</div>,
    },
    {
      accessorKey: 'Successful Referrals',
      accessorFn: (row) => row.vendor,
      header: 'Total Successful Referrals',
      cell: ({ row }) => <div>{row?.original?._count?.LeadConversions ?? 0}</div>,
    },
    {
      accessorKey: 'Eyewear Sold',
      accessorFn: (row) => row.vendor,
      header: 'Total Eyewear Sold',
      cell: ({ row }) => <div>{row?.original?.extras?.glassesPurchased ?? 0}</div>,
    },
    {
      accessorKey: 'Total Sales (RMB)',
      header: 'Total Sales (RMB)',
      cell: ({ row }) => (
        <div>{row?.original?.extras?.purchaseAmountRmb ?? 0}</div>
      ),
    },
    {
      accessorKey: 'Eye Partner',
      accessorFn: (row) => row.vendor,
      header: 'Eye Partner',
      cell: ({ row }) => <div>{row?.original?.vendor?.name ?? '—'}</div>,
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
                  `/projects/el-village-doctor/${id}/chw/${row.original.uuid}`,
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
