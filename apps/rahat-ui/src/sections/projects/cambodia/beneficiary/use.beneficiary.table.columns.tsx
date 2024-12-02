import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useCambodiaBeneficiaryTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row?.original?.piiData?.name}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return <div>{row?.original?.type || 'UNKNOWN'}</div>;
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row?.original?.piiData?.phone}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row?.original?.projectData?.gender}</div>,
    },
    {
      accessorKey: 'healthWorker',
      header: 'Health Worker',
      cell: ({ row }) => {
        return <div>{row?.original?.healthWorker?.name || '-'}</div>;
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
                  `/projects/el-cambodia/${id}/beneficiary/${row.original.uuid}`,
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

export const useDiscardedCambodiaBeneficiaryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return <div>{row?.original?.extras?.type || 'UNKNOWN'}</div>;
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'healthWorker',
      header: 'Health Worker',
      cell: ({ row }) => <div>{row?.original?.healthWorker?.name || '-'}</div>,
    },
  ];

  return columns;
};
