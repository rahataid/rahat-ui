import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export const useFundManagementColumns = () => {
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
              // onClick={() => router.push(`projects/aa/${pid}/fund-management/1`)}
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
