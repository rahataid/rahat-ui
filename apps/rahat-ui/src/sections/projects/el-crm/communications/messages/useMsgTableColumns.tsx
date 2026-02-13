import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye } from 'lucide-react';
import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Link from 'next/link';

export const useMsgTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800';
      case 'WhatsApp':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Scheduled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'transportName',
      header: 'Channel',
      cell: ({ row }) => (
        <Badge
          className={getChannelColor(row.getValue('transportName'))}
          variant="secondary"
        >
          {row.getValue('transportName')}
        </Badge>
      ),
    },
    {
      accessorKey: 'targetType',
      header: 'Group',
      cell: ({ row }) => <div>{row.getValue('targetType') || 'N/A'}</div>,
    },
    {
      accessorKey: 'recipients',
      header: 'Recipients',
      cell: ({ row }) => <div>{row.getValue('recipients') || 'N/A'}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created Date',
      cell: ({ row }) => (
        <div>
          {row.getValue('createdAt')
            ? new Date(row.getValue('createdAt')).toLocaleString()
            : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.getValue('status'))}>
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Link
            href={`/projects/el-crm/${id}/communications/messages/${row.original.uuid}`}
          >
            <Eye className="h-4 w-4 rounded-full hover:bg-gray-300" />
          </Link>
        );
      },
    },
  ];
  return columns;
};
