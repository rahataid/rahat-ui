import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { IProjectVendor } from './types';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export const useProjectVendorTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();

  const handleViewClick = (vendorId: string) => {
    router.push(`/projects/aa/${id}/vendors/${vendorId}`);
  };
  const columns: ColumnDef<IProjectVendor>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone') || 'N/A'}</div>,
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

export const useProjectVendorRedemptionTableColumns = () => {
  function renderBadgeStyle(status: string) {
    if (status === 'Approved') {
      return 'bg-green-100 text-green-500';
    }

    return 'bg-blue-100 text-blue-500';
  }
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'tokenAmout',
      header: 'Token Amount',
      cell: ({ row }) => <div>{row.getValue('tokenAmount') || 'N/A'}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge className={renderBadgeStyle(row.original.status)}>
          {row.original.status || 'N/A'}
        </Badge>
      ),
    },
    {
      accessorKey: 'approvedBy',
      header: 'Approved By',
      cell: ({ row }) => <div>{row.getValue('approvedBy') || 'N/A'}</div>,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Approved Date',
      cell: ({ row }) => <div>{row.getValue('updatedAt') || 'N/A'}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost">Approve</Button>
          </div>
        );
      },
    },
  ];
  return columns;
};
