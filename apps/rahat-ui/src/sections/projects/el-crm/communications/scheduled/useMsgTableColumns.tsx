import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Eye } from 'lucide-react';
import React from 'react';

export const useScheduledTableColumn = () => {
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
    return status === 'Scheduled' ? 'default' : 'secondary';
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'templateName',
      header: 'Template',
      cell: ({ row }) => <div>{row.getValue('templateName')}</div>,
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => (
        <Badge
          className={getChannelColor(row.getValue('channel'))}
          variant="secondary"
        >
          {row.getValue('channel')}
        </Badge>
      ),
    },
    {
      accessorKey: 'group',
      header: 'Group',
      cell: ({ row }) => <div>{row.getValue('group') || 'N/A'}</div>,
    },
    {
      accessorKey: 'recipients',
      header: 'Recipients',
      cell: ({ row }) => <div>{row.getValue('recipients') || 'N/A'}</div>,
    },
    {
      accessorKey: 'scheduledDate',
      header: 'Scheduled Date',
      cell: ({ row }) => <div>{row.getValue('scheduledDate') || 'N/A'}</div>,
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
        return <Eye className="h-4 w-4 rounded-full hover:bg-gray-300" />;
      },
    },
  ];
  return columns;
};
