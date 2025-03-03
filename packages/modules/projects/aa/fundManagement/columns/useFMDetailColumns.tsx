import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useFMDetailTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (fmId: string) => {
    router.push(`/projects/aa/${id}/vendors/${fmId}`);
  };
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiaries',
      header: 'Beneficiaries',
      cell: ({ row }) => <div>{row.getValue('beneficiaries') || 'N/A'}</div>,
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => <div>{row.getValue('walletAddress') || 'N/A'}</div>,
    },
    {
      accessorKey: 'tokensAssigned',
      header: 'Tokens Assigned',
      cell: ({ row }) => <div>{row.getValue('tokensAssigned') || 'N/A'}</div>,
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
