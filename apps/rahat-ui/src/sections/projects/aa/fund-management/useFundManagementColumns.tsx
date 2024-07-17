import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { setPaginationToLocalStorage } from '../prev.pagination.storage';

export const useFundManagementColumns = () => {
  const router = useRouter();
  const { id: projectID } = useParams();

  const handleEyeClick = (id: any) => {
    setPaginationToLocalStorage();
    router.push(`/projects/aa/${projectID}/fund-management/${id}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'beneficiaryGroup',
      header: 'Beneficiary Group',
      cell: ({ row }) => <div>{row?.original?.group?.name}</div>,
    },
    {
      accessorKey: 'numberOfTokens',
      header: 'Number of token',
      cell: ({ row }) => <div>{row.getValue('numberOfTokens')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        console.log(row);

        return (
          <div className="flex items-center justify-evenly">
            <Eye
              className="cursor-pointer"
              onClick={() => handleEyeClick(row.original.uuid)}
              size={20}
              strokeWidth={1.25}
            />
            <Pencil
              className="text-blue-600 cursor-pointer"
              size={20}
              strokeWidth={1.25}
            />
            <Trash2
              className="text-red-600 cursor-pointer"
              size={20}
              strokeWidth={1.25}
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
