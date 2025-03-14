import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IFundManagement } from '../types';

export const useFundManagementTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (fmId: string) => {
    router.push(`/projects/aa/${id}/fund-management/${fmId}`);
  };
  const columns: ColumnDef<IFundManagement>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title') || 'N/A'}</div>,
    },
    {
      accessorKey: 'beneficiaryGroup',
      header: 'Beneficiary Group',
      cell: ({ row }) => <div>{row.getValue('beneficiaryGroup') || 'N/A'}</div>,
    },
    {
      accessorKey: 'tokens',
      header: 'Tokens',
      cell: ({ row }) => <div>{row.getValue('tokens') || 'N/A'}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => <div>{row.getValue('createdBy') || 'N/A'}</div>,
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
              onClick={() => handleViewClick(row.original.uuid)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
