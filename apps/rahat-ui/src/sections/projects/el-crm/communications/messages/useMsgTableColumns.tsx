import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { targetTypeMap } from '../const';

export const useMsgTableColumn = () => {
  const { id } = useParams();
  const router = useRouter();

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'bg-primary/10 text-primary';
      case 'WhatsApp':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Sent':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
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
      cell: ({ row }) => {
        const value = row.getValue('targetType') as keyof typeof targetTypeMap;

        return <div>{targetTypeMap[value] || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'recipientCount',
      header: 'Recipients',
      cell: ({ row }) => <div>{row.getValue('recipientCount') || 'N/A'}</div>,
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
      accessorKey: 'sessionId',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          className={getStatusColor(
            row.getValue('sessionId') ? 'Sent' : 'Draft',
          )}
        >
          {row.getValue('sessionId') ? 'Sent' : 'Draft'}
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
            <Eye className="h-4 w-4 rounded-full hover:bg-accent" />
          </Link>
        );
      },
    },
  ];
  return columns;
};
